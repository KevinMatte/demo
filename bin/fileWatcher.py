#!bin/venv/bin/python

"""
Watches a set of directories or files for any change and exits on change.

See full details in process_args() below. or running python filesWatcher.py -h

"""

import glob
import os.path
import time
import re
import yaml
import subprocess
from argparse import ArgumentParser, Namespace, RawTextHelpFormatter
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, DirCreatedEvent, FileCreatedEvent, DirDeletedEvent, \
    FileDeletedEvent, DirModifiedEvent, FileModifiedEvent, DirMovedEvent, FileMovedEvent

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper


def process_args() -> tuple[Namespace, ArgumentParser]:

    # Program's description
    help_program = """Monitor's a paths and executes commands when something changes:
    
        Example YAML:
# ==========================================================================
# This sets up default values for all following targets.
# The __defaults__ for one YAML file are NOT passed onto the next.
"__defaults__":
  # When the file in '--skip_file {file}' exists, these commands are run rather than the 'commands'
  skipped:
    - "bin/say.py '_MONITOR_NAME_: Skip file exists. Skipping.' 2>/dev/null"

  # Executed before running 'commands'
  started:
    - "bin/say.py '_MONITOR_NAME_: Starting' 2>/dev/null"

  # Executed after running 'commands' successfully.
  completed:
    - "make build_done"
    - "bin/say.py '_MONITOR_NAME_: Completed' 2>/dev/null"

  # Executed after running 'commands' failed.
  error:
    - "bin/say.py '_MONITOR_NAME_: Error' 2>/dev/null"

  # Fall-back commands if 'commands' is not specified.
  commands:
    - "bin/say.py '_MONITOR_NAME_: Missing commands' 2>/dev/null"

# This is the start of a declaration of files/paths to monitor and commands to execute.
"static and environment":

  # When a file/path changes, these commands will be executed.
  commands:
    - "make update_dot_env"
    - "make -C images/demo_ui"
    - "make update_dot_env"
    - "make -C images/demo_ui build_static"

  # A list of files/paths and file name patterns to monitor.
  searches:
    # Not used. Just nice to see.
    - name: 'static'
      # A list of paths to directories or files.
      paths: ["images/demo_ui/src/static"]
      # Optional. If given, the full path must match this python regular expression.
      # You could include directories in these patterns, but if possible, don't, I think.
      patterns: ['.*\\.js$', '.*\\.jsx$', '.*\\.css$', '.*\\.htm$l', '.*\\.py$', '.*\\.php$']

    # A search example without patterns.
    - name: 'environment'
      paths: ['.env', '.secrets.env']
# --------------------------------------------------------------------------
        """

    # Help on paths from program's argv
    help_args_paths = "One or more YAML files like the above."
    help_opt_verbose = "Print extra processing information to stdout."
    help_opt_repeat = "After targets found, repeat monitor in 1 second"
    help_volume = "Set the volume."
    help_tempo = "Set the tempo."
    help_skip_file = "If provided, when a file is changed and this file exists, the commands are skipped."

    # Parse command-line argument
    arg_parser = ArgumentParser(formatter_class=RawTextHelpFormatter, description=help_program)
    arg_parser.add_argument('paths', nargs="*", help=help_args_paths)
    arg_parser.add_argument("-v", "--verbose", help=help_opt_verbose, default=False, action='store_true')
    arg_parser.add_argument("-r", "--repeat", help=help_opt_repeat, default=False, action='store_true')
    arg_parser.add_argument("-e", "--exit_on_error", help=help_opt_repeat, default=False, action='store_true')
    arg_parser.add_argument('-V', '--volume', default="0.3", help=help_volume)
    arg_parser.add_argument('-T', '--tempo', default="1.9", help=help_tempo)
    arg_parser.add_argument('-s', '--skip_file', default=None, help=help_skip_file)
    args = arg_parser.parse_args()

    if len(args.paths) == 0:
        arg_parser.print_help()
        exit(1)

    return args, arg_parser



class MonitorAnyFileChange(FileSystemEventHandler):
    """An event handler class for Observer instances.
    For the patch being monitored, keeps track of the 'commands', the file extensions and state of events.
    """

    def __init__(self, path, monitor_defn, monitor):
        super().__init__()

        # Store parameters
        self._path = path
        self.monitor_defn = monitor_defn
        self._monitor = monitor

        # Init
        self._files = set()

    def has_change(self) -> bool:
        """Returns True iff any file change event has occurred. """
        return len(self._files) > 0

    def get_files(self):
        return self._files

    def _handle_event(self, event):
        """Event handler for an Observer.

        If a matching any file extension or no extensions given for the target,
        records the event's filepath reference.
        """
        if 'patterns' in self._monitor:
            for file_extension in self._monitor['patterns']:
                if re.match(file_extension, event.src_path):
                    self._files.add(event.src_path)
                    break
        elif event.src_path:
            self._files.add(event.src_path)

    def on_created(self, event: DirCreatedEvent | FileCreatedEvent) -> None:
        """@see _handle_event()"""
        self._handle_event(event)

    def on_deleted(self, event: DirDeletedEvent | FileDeletedEvent) -> None:
        """@see _handle_event()"""
        self._handle_event(event)

    def on_modified(self, event: DirModifiedEvent | FileModifiedEvent) -> None:
        """@see _handle_event()"""
        self._handle_event(event)

    def on_moved(self, event: DirMovedEvent | FileMovedEvent) -> None:
        """@see _handle_event()"""
        self._handle_event(event)


class FilesWatcher:
    """Main class for this script. See help at top of file."""

    def __init__(self, args, parser):
        self.args = args
        self.parser = parser
        self.observers = []
        self.event_handlers = []
        self._monitor_defns_defaults = {}
        self.observer = None

    def _setup_observers(self):
        """Observers and event handlers are recreated on each call to start(). """
        self.observers = []
        self.event_handlers = []

        # Parse monitor yamls and start them.
        if self.args.verbose:
            print("Monitoring:")
        for yaml_file in self.args.paths:
            with open(yaml_file, 'r') as f:
                monitor_defns = yaml.load(f, Loader=Loader)
                self._start_monitors(yaml_file, monitor_defns)

    def _start_monitors(self, source, monitor_defns):
        self._monitor_defns_defaults = {}

        # Loop over array of monitor definitions.
        for defn_name, monitor_defn in monitor_defns.items():
            if defn_name == '__defaults__':
                self._monitor_defns_defaults = monitor_defn
                continue

            # At yaml key as a name and as a compined source filename and monitor name.
            monitor_defn = self._monitor_defns_defaults | monitor_defn
            monitor_defn['__name'] = defn_name
            monitor_defn['__key'] = f"{source}:{defn_name}"

            # Loop over search paths
            for search_defn in monitor_defn['searches']:
                found_path = False
                i_glob = None
                for i_glob, path_glob in enumerate(search_defn['paths']):
                    for path in glob.iglob(path_glob, recursive=True):
                        found_path = True
                        self._add_monitor(path, monitor_defn, search_defn)

                # Tree glob as a non-existent path if glob fails to expand.
                if not found_path and i_glob is not None:
                    print(f"ERROR: No glob expansion for: {monitor_defn['paths'][i_glob]}.")
                    if self.args.exit_on_error:
                        exit(1)

    def _add_monitor(self, path: str, monitor_defn, monitor):
        """Create and starts a new path Observer."""

        # One Observer for all paths.
        self.observer = Observer()

        # Create Observer event handlers that contain extra context information.
        event_handler = MonitorAnyFileChange(path, monitor_defn, monitor)

        self.observer.schedule(event_handler, path, recursive=True)
        try:
            self.observer.start()
        except FileNotFoundError:
            print(f"ERROR: File not found: {path}")
            if self.args.exit_on_error:
                exit(1)

        # Add observer and event handler to list.
        self.observers.append(self.observer)
        self.event_handlers.append(event_handler)

    def start(self):
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
                if event_handler.has_change():
                    files = event_handler.get_files()
                    if files:
                        print(f"Targets {event_handler}: {" ".join(files)}")

        # Return set of target names with changes.
        triggered_monitor_defn_keys = set()
        triggered_event_handlers = []
        has_skip_file = self.args.skip_file and os.path.exists(self.args.skip_file)
        for event_handler in self.event_handlers:
            if event_handler.has_change():
                triggered_event_handlers.append(event_handler)
                monitor_key = event_handler.monitor_defn['__key']
                if not monitor_key in triggered_event_handlers:
                    triggered_monitor_defn_keys.add(monitor_key)
                    if has_skip_file:
                        self._run_commands(event_handler.monitor_defn, 'skipped')
                    else:
                        print(f"Executing {monitor_key}")
                        res = self._run_commands(event_handler.monitor_defn, 'commands')
                        self._run_commands(event_handler.monitor_defn, 'completed' if res == 0 else 'error')
                        print()

    def _run_commands(self, monitor_defn, commands_key):
        if commands_key in monitor_defn:
            for command in monitor_defn[commands_key]:
                command = command.replace('_MONITOR_NAME_', monitor_defn['__name'])
                res = subprocess.run(command, shell=True)
                if res.returncode:
                    return res.returncode
        return 0


def main():
    """main function for direct run of script."""

    args, parser = process_args()
    files_watcher = FilesWatcher(args, parser)
    files_watcher.start()

    # If --repeat, re-initialize and start watch again.
    # Note: re-initializing may pick up globs that didn't previously exist.
    while args.repeat:
        time.sleep(1)
        print("---")
        files_watcher.start()


if __name__ == "__main__":
    main()
    exit(0)
