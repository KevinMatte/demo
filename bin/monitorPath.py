#!venv/bin/python
import glob
import time

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

file_changed = False


class MonitorAnyFileChange(FileSystemEventHandler):

    def __init__(self, filters):
        super().__init__()
        self.filters = filters

    def on_any_event(self, event):
        global file_changed
        if self.filters:
            for filter in self.filters:
                if event.src_path.endswith(filter):
                    file_changed = True
                    break


def main():
    import argparse
    global file_changed

    # Parse command-line argument
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawTextHelpFormatter,
        description="""Monitor's a paths (recursively) for changes.
    
    Note: globs allowed: **, *, ?
    
    Exit's with 0 if there was a change and 1 if something else caused the exit.
    """)

    help = """One or more glob/wildcard paths to monitor.
    
    {path}[,{filter}]... A list of paths with optional suffix filters.
    Example: src,.js,.jsx,.css,.html
    """
    parser.add_argument('paths', nargs="*", help=help)
    args = parser.parse_args()

    if len(args.paths) == 0:
        parser.print_help()
        exit(1)

    # Start monitor
    observers = []
    print("Monitoring:")
    for path_glob in args.paths:
        is_root = False
        if ',' in path_glob:
            filters = path_glob.split(',')
            path_glob = filters.pop(0)
        else:
            filters = None

        for path in glob.iglob(path_glob, recursive=True):
            observer = Observer()
            event_handler = MonitorAnyFileChange(filters)
            observer.schedule(event_handler, path, recursive=True)
            try:
                print(f"    {path}: {filters}")
                observer.start()
            except FileNotFoundError:
                print(f"ERROR: File not found: {path}")
                exit(1)
            observers.append(observer)

    # Monitor until a file or directory changes.
    try:
        while not file_changed:
            time.sleep(1)  # Keep the main thread alive
    finally:
        for observer in observers:
            observer.stop()
            observer.join()

    if file_changed:
        exit(0)
    else:
        exit(1)


if __name__ == "__main__":
    main()
