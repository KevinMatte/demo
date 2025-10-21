#!venv/bin/python
import glob
import time

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

targets_changed = set()


class MonitorAnyFileChange(FileSystemEventHandler):

    def __init__(self, target_name, filters):
        super().__init__()
        self.target_name = target_name
        self.filters = filters

    def on_any_event(self, event):
        global targets_changed
        if self.filters:
            for filter in self.filters:
                if event.src_path.endswith(filter):
                    targets_changed.add(self.target_name)
                    break


def main():
    import argparse
    global targets_changed

    # Parse command-line argument
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawTextHelpFormatter,
        description="""Monitor's a paths (recursively) for changes.
    
    Note: globs allowed: **, *, ?
    
    Exit's with 0 if there was a change and 1 if something else caused the exit.
    """)

    help = """One or more glob/wildcard paths to monitor.
    
    [{target_name}@]{path}[,{filter}]... A list of paths with optional suffix filters.
    Example: build_mounted:src,.js,.jsx,.css,.html
    
    - target_name is optional. 'path' is used if it's not provided. The script will print this string when
      the first file hit is found.
    
    """
    parser.add_argument('paths', nargs="*", help=help)
    parser.add_argument("-q", "--quiet", help="Quiet. Output arg's name only", default=False, action='store_true')
    args = parser.parse_args()

    if len(args.paths) == 0:
        parser.print_help()
        exit(1)

    names_by_glob = {}

    # Start monitor
    observers = []
    if not args.quiet:
        print("Monitoring:")
    for path_defn in args.paths:
        parts = path_defn.split('@')
        target_name = False if len(parts) == 1 else parts.pop(0)
        parts = parts[0].split(':')
        path_glob = parts.pop(0)
        target_name = path_glob if not target_name else target_name
        if parts:
            filters = parts[0].split(',')
        else:
            filters = None

        for path in glob.iglob(path_glob, recursive=True):
            observer = Observer()
            event_handler = MonitorAnyFileChange(target_name, filters)
            observer.schedule(event_handler, path, recursive=True)
            try:
                if not args.quiet:
                    print(f"    {target_name}@{path}:{",".join(filters)}")
                observer.start()
            except FileNotFoundError:
                print(f"ERROR: File not found: {path}")
                exit(1)
            observers.append(observer)

    # Monitor until a file or directory changes.
    start_change = None
    try:
        while not targets_changed:
            time.sleep(1)  # Keep the main thread alive
        time.sleep(1)
    finally:
        for observer in observers:
            observer.stop()
            observer.join()

    if targets_changed:
        print(" ".join(targets_changed))
        exit(0)
    else:
        exit(1)


if __name__ == "__main__":
    main()
