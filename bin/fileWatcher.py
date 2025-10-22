#!venv/bin/python

"""
Watches a set of directories or files for any change and exits on change.

See full details in process_args() below. or running python filesWatcher.py -h

"""

import glob
import time
from argparse import ArgumentParser, Namespace, RawTextHelpFormatter

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, DirCreatedEvent, FileCreatedEvent, DirDeletedEvent, \
    FileDeletedEvent, DirModifiedEvent, FileModifiedEvent, DirMovedEvent, FileMovedEvent


def process_args() -> tuple[Namespace, ArgumentParser]:

    # Program's description
    help_program = """Monitor's a paths (recursively) for changes.
        
        Note: globs allowed: **, *, ?
        
        Exit's with 0 if there was a change and 1 if something else caused the exit.
        """

    # Help on paths from program's argv
    help_args_paths = """One or more glob/wildcard paths to monitor.
        
        [{target_name}@]{path}[,{filter}]... A list of paths with optional suffix filters.
        Example: build_mounted:src,.js,.jsx,.css,.html
        
        - target_name is optional. 'path' is used if it's not provided. The script will print this string when
          the first file hit is found.
        
        """

    help_opt_verbose = "Print extra processing information to stdout."
    help_opt_repeat = "After targets found, repeat monitor in 1 second"

    # Parse command-line argument
    arg_parser = ArgumentParser(formatter_class=RawTextHelpFormatter, description=help_program)
    arg_parser.add_argument('paths', nargs="*", help=help_args_paths)
    arg_parser.add_argument("-v", "--verbose", help=help_opt_verbose, default=False, action='store_true')
    arg_parser.add_argument("-r", "--repeat", help=help_opt_repeat, default=False, action='store_true')
    args = arg_parser.parse_args()

    if len(args.paths) == 0:
        arg_parser.print_help()
        exit(1)

    return args, arg_parser



class MonitorAnyFileChange(FileSystemEventHandler):
    """An event handler class for Observer instances.
    For the patch being monitored, keeps track of the 'target_name', the file extensions and state of events.
    """

    def __init__(self, target_name, file_extensions):
        super().__init__()

        self._target_name = target_name
        self._file_extensions = file_extensions
        self._files = set()

    def get_target_name(self) -> str:
        """Returns the target_name passed in the contsructor."""
        return self._target_name

    def has_change(self) -> bool:
        """Returns True iff any file change event has occurred. """
        return len(self._files) > 0

    def get_files(self):
        return self._files

    def _handle_event(self, event):
        """Event handler for an Observer."""
        if self._file_extensions:
            for file_extension in self._file_extensions:
                if event.src_path.endswith(file_extension):
                    self._files.add(event.src_path)
                    break

    def on_created(self, event: DirCreatedEvent | FileCreatedEvent) -> None:
        self._handle_event(event)

    def on_deleted(self, event: DirDeletedEvent | FileDeletedEvent) -> None:
        self._handle_event(event)

    def on_modified(self, event: DirModifiedEvent | FileModifiedEvent) -> None:
        self._handle_event(event)

    def on_moved(self, event: DirMovedEvent | FileMovedEvent) -> None:
        self._handle_event(event)


class FilesWatcher:
    """Main class for this script. See help at top of file."""

    def __init__(self, args, parser):

        self.args = args
        self.parser = parser
        self.observers = []
        self.event_handlers = []


    def _setup_observers(self):
        """Observers and event handlers are recreated on each call to start(). """
        self.observers = []
        self.event_handlers = []

        # Start monitor
        if self.args.verbose:
            print("Monitoring:")
        for path_defn in self.args.paths:
            parts = path_defn.split('@')
            target_name = False if len(parts) == 1 else parts.pop(0)
            parts = parts[0].split(':')
            path_glob = parts.pop(0)
            target_name = path_glob if not target_name else target_name
            if parts:
                file_extensions = parts[0].split(',')
            else:
                file_extensions = []

            for path in glob.iglob(path_glob, recursive=True):
                observer = Observer()
                event_handler = MonitorAnyFileChange(target_name, file_extensions)
                observer.schedule(event_handler, path, recursive=True)
                try:
                    if self.args.verbose:
                        print(f"    {target_name}@{path}:{",".join(file_extensions)}")
                    observer.start()
                except FileNotFoundError:
                    print(f"ERROR: File not found: {path}")
                    exit(1)
                self.observers.append(observer)
                self.event_handlers.append(event_handler)

    def start(self) -> set:
        """
        :return: A set of target names where files have been changed (within 1 second of first change found)
        """
        self._setup_observers()

        # Monitor until a path change is observed.
        try:
            # 1 sec periodically check if there are any changes.
            has_change = False
            while not has_change:
                for event_handler in self.event_handlers:
                    if event_handler.has_change():
                        has_change = True
                        break

                time.sleep(1)
            
        finally:
            # Wait 1 more second for any other changes, before stopping observers.
            time.sleep(1)

            # Stop observers
            for observer in self.observers:
                observer.stop()
                observer.join()

        if self.args.verbose:
            for event_handler in self.event_handlers:
                files = event_handler.get_files()
                if files:
                    print(f"Target {event_handler.get_target_name()}: {" ".join(files)}")

        # Return set of target names with changes.
        targets_changed = set(event_handler.get_target_name()
                              for event_handler in self.event_handlers
                              if event_handler.has_change())
        return targets_changed


def main():
    """main function for direct run of script."""
    args, parser = process_args()
    files_watcher = FilesWatcher(args, parser)
    targets_changed = files_watcher.start()
    print(" ".join(targets_changed))

    while args.repeat:
        time.sleep(1)
        print("---")
        targets_changed = files_watcher.start()
        print(" ".join(targets_changed))

    exit(0)

if __name__ == "__main__":
    main()