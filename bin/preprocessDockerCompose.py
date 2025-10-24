#!bin/venv/bin/python

import re
from argparse import ArgumentParser, Namespace, RawTextHelpFormatter

def process_args() -> tuple[Namespace, ArgumentParser]:

    # Program's description
    help_program = """Searches for commented #if...#endif's to generate compose.yml files."""

    # Help on paths from program's argv
    help_args_paths = """{input file} {output file} {csv list of flags}"""

    # Parse command-line argument
    arg_parser = ArgumentParser(formatter_class=RawTextHelpFormatter, description=help_program)
    arg_parser.add_argument('input_file')
    arg_parser.add_argument('output_file')
    arg_parser.add_argument('flags')
    args = arg_parser.parse_args()

    return args, arg_parser

# upper_dict.py

class DictWithDefault(dict):

    def __init__(self, default=None):
        super().__init__()
        self.default_value = default

    def __getitem__(self, key):
        if key in self:
            return super().__getitem__(key)
        else:
            return self.default_value

def process_compose(args, parser):
    flags = DictWithDefault(False)
    for flag in args.flags.split(' '):
        flag = flag.strip()
        if flag:
            flags[flag] = True

    re_if = re.compile('^ *# *#if (?P<expr>.*)')
    re_else = re.compile('^ *# *#else')
    re_endif = re.compile('^ *# *#endif')
    expressions = []
    show = True
    with open(args.input_file, 'r') as input_file:
        with open(args.output_file, 'w') as output_file:
            for line in input_file:
                match = re_if.match(line)
                if match:
                    expr = match.group('expr')
                    new_show = eval(expr, {}, flags)
                    expressions.append(show)
                    if show and not new_show:
                        show = False
                elif re_else.match(line):
                    show = not show
                elif re_endif.match(line):
                    show = expressions.pop()
                elif show:
                    if expressions and line.startswith('#'):
                        line = line[1:]
                    output_file.write(line)


def main():
    """main function for direct run of script."""
    args, parser = process_args()
    process_compose(args, parser)

if __name__ == "__main__":
    main()
    exit(0)
