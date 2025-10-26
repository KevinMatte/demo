#!bin/venv/bin/python

from gtts import gTTS
import os
import tempfile
from argparse import ArgumentParser, Namespace, RawTextHelpFormatter

global ARGV

def process_args() -> tuple[Namespace, ArgumentParser]:

    # Program's description
    help_program = """Plays text--to-audio using gTTS and system's play command.
        
        Exit's with 0 if there was a change and 1 if something else caused the exit.
        """

    # Help on paths from program's argv
    help_volume = "Set the volume."
    help_messages = """One or more text messages to play"""

    # Parse command-line argument
    arg_parser = ArgumentParser(formatter_class=RawTextHelpFormatter, description=help_program)
    arg_parser.add_argument('-v', '--volume', default="0.3", help=help_volume)
    arg_parser.add_argument('-t', '--tempo', default="1.9", help=help_volume)
    arg_parser.add_argument('messages', nargs="*", help=help_messages)
    args = arg_parser.parse_args()

    if len(args.messages) == 0:
        arg_parser.print_help()
        exit(1)

    return args, arg_parser

def main():
    args, arg_parser = process_args()
    my_text=" ".join(args.messages)
    with tempfile.NamedTemporaryFile(dir="/tmp", prefix="say_", suffix=".mp3") as file:
        language = 'en'
        myobj = gTTS(text=my_text, lang=language, slow=False)
        myobj.save(file.name)
        os.system(f"play -v {args.volume} {file.name} tempo {args.tempo}")

if __name__ == "__main__":
    main()
    exit(0)
