#!/usr/bin/python3
import os.path
from os.path import exists
import sys
import re
import argparse
import glob
import shutil

def run_shell(script, exit_on_error=False):
    import subprocess
    res = subprocess.run(script, shell=True, capture_output=True)
    stderr = res.stderr.decode(encoding='utf-8')
    stdout = res.stdout.decode(encoding='utf-8')
    if res.returncode != 0 and exit_on_error:
        print(f"> {script}")
        print(stderr)
        exit(1)
    return [res.returncode, stdout, stderr]

num_errors = 0

def create_script_argument_parser():
    """

    :return:
    """
    description = f"""
    Provides section numbers on markdown lines and optionally table of contents.
    
    If no files are given, uses list of files found by git diff with main branch or git status.
    
    For new Markdown References, create a reference with just the section's title.
    
    Example 1: Type
         [Usage](#Usage section)
      will be updated to refer to section 3 with that label:
         ### Usage section
      and update the reference to something like:
         [Usage](#5.3-usage-section)
         
    Example 2: Type
        [Usage]Otherfile.md#Usage section)
      will be updated to refer to section 3 in Otherfile.md with that label:
         ### Usage section
      You must include OtherFile.md as a parameter, for this reference to be re-worked.
      
    Note: Use `[[_TOC]]` to generate the table of contents, not this script.
    
    Note: CHANGELOG.md will be skipped unless it's included on the command line.
    """
    parser = argparse.ArgumentParser(description=description, formatter_class=argparse.RawDescriptionHelpFormatter)

    description = "Write back to input file"
    parser.add_argument('--stdout', '-i', dest='stdout', action='store_const', const=True, required=False,
                        default=False, help=description)
    description = "Validate only"
    parser.add_argument('--validate', '-v', dest='validate', action='store_const', const=True, required=False,
                        default=False, help=description)
    description = "Backup files to *.bak"
    parser.add_argument('--backup', '-b', dest='backup', action='store_const', const=True, required=False,
                        default=False, help=description)
    group = parser.add_argument_group('File List')
    descripton = "Use all *.md from current directory"
    group.add_argument('--all', '-a', dest='all', action='store_const', const=True, required=False,
                       default=False, help=descripton)
    descripton = "Add to git calculated list of changed files the arguments as files."
    group.add_argument('--add', '-A', dest='add_files', action='store_const', const=True, required=False,
                       default=False, help=descripton)
    descripton = "List *.md files automatically found or on the command line. Do nothing else"
    group.add_argument('--list_files', '-l', dest='list_files', action='store_const', const=True, required=False,
                       default=False, help=descripton)
    description = "List all files automatically found or on the command line. Do nothing else."
    group.add_argument('--list_all_files', '-L', dest='list_all_files', action='store_const', const=True, required=False,
                       default=False, help=description)
    group = parser.add_argument_group('Sections')
    description = "Indent sections. A CSV list of sections with '=', '-' or '+' to keeep, reduce or increase indents"
    group.add_argument('--indent', '-I', dest='indent', nargs=1, required=False,
                        help=description)
    description = "Add section numbers"
    group.add_argument('--section_numbers_add', '-n', dest='add_section_numbers', nargs=1, required=False,
                        help=description)
    description = "Remove section numbers"
    group.add_argument('--section_numbers_remove', '-N', dest='remove_section_numbers', action='store_const', const=True, required=False,
                       default=False, help=description)
    group = parser.add_argument_group('Table of Contents')
    description = "Add table of contents and links."
    group.add_argument('--toc_add', '-t', dest='add_toc', action='store_const', const=True, required=False,
                       default=False, help=description)
    description = "Remove table of contents and links."
    group.add_argument('--toc_remove', '-T', dest='remove_toc', action='store_const', const=True, required=False,
                       default=False, help=description)
    description="Verbose mode: Describes all git actions"
    parser.add_argument('--verbose', '-V', dest='verbose', action='store_const', const=True, required=False,
                       default=False, help=description)
    parser.add_argument('files', help="Markdown files", nargs='*')
    return parser

class MDFile:
    """
    Finds sections and references to sections producing a new list of lines
    with corrected sections and printing a list of changes or unknown section references.

    Uses results of func: create_script_argument_parser

    """
    tableOfContentsLine = "<h1>Table of Contents</h1>"

    def __init__(self, sections, file_path, scan_only=False, is_external_file=False):
        """
        New instance
        :param sections:
        :param file_path:
        :param scan_only:
        """
        self.sections = sections
        self.file_path = file_path
        self.file_path_abs = os.path.abspath(self.file_path)
        self.file_path_abs_dir = os.path.dirname(self.file_path_abs)
        self.scan_only = scan_only
        self.is_external_file = is_external_file

        self.toc = []
        self.body = []
        if self.sections.args.indent:
            self.indents = {(v[1:] + '.'): v[0] for v in self.sections.args.indent}
        else:
            self.indents = []

        # A list of numbers such as 1,2,3 for 1.2.3
        self.current_section = []
        self.max_sec_test_width = 0
        self.current_line_no = 0
        self.current_line_in_toc = False

        self.indent_op = None
        self.indent_sec = ""
        self.in_quote = False
        self.has_change = False

    def parse(self):

        with open(self.file_path, 'r') as input_stream:
            for src_line in input_stream:
                line = src_line.rstrip()
                self.current_line_no += 1


                if len(line) >= 3 and line[0:3] == r'```':
                    self.in_quote = not self.in_quote
                    self.body.append(line)
                    continue
                elif self.in_quote:
                    self.body.append(line)
                    continue


                if self.current_line_in_toc:
                    if line == '---':
                        self.current_line_in_toc = False
                    continue
                elif line == self.tableOfContentsLine:
                    self.current_line_in_toc = True
                    continue
                else:
                    if re.match("^<a id='sec_.*</a>", line):
                        continue

                    if not self.scan_only:
                        line = self.process_line_refs(line)

                    line = self.process_line_section(line)

                    # Add section or body line to body.
                    self.body.append(line)
                    if not self.has_change and line != src_line.rstript():
                        self.has_change = True

    def add_all_abs_ref_set(self, line):
        m = re.match(r"\[(?P<label>[^]]+)]\((?P<file>[.\w\-/]+(.md)?)#.*\)", line)
        if m:
            ref_file_path = self.get_ref_file_path(m.group('file'))
            if exists(ref_file_path):
                self.sections.all_abs_ref_set.add(ref_file_path)

        def process_line_section(self, line):
            self.add_all_abs_ref_set(line)

            # Check for section lline. Ex: ^## A section description."
            m = re.match(r"^ *(?P<sec>#+)( (?P<retain> *(?P<sec_num_str>[0-9.]+) ))? *(?P<sec_text>.*)", line)
            if m:

                # Get values for self.args.indents processing.
                sec_str = m.group('sec')
                sec_text = m.group('sec_text')

                sec_num_str = m.group('sec_num_str') or ''
                if sec_num_str != '' and sec_num_str[-1] != '.':
                    sec_num_str += '.'
                if self.is_external_file or self.sections.retain_sections or self.sections.args.validate:
                    if m.group('retain'):
                        sec_text = m.group('retain') + sec_text
                    insert_sections = False
                else:
                    insert_sections = self.sections.args.add_section_numbers
                    sec_str = self.process_indent_ops(sec_num_str, sec_str)

                # Evaluate new section number.
                level = len(sec_str) - 1
                while len(self.current_section) <= level:
                    self.current_section.append(0)
                self.current_section[level] += 1
                self.current_section = self.current_section[0:level + 1]

                # Put together updated section line
                if insert_sections:
                    sec = '.'.join(str(l) for l in self.current_section)
                    self.max_sec_text_width = max(self.max_sec_text_width, len(sec))
                    line = f"{sec_str} {sec} {sec_text}"
                    link_text = f"{sec} {sec_text}"
                else:
                    sec = ''
                    line = f"{sec_str} {sec_text}"
                    link_text = sec_text

                link = link_text.lower().replace(" ", "-")
                link = re.sub('[()]', '-', link)
                link = re.sub('[^\w-]', '-', link)
                sec_record = {
                    'file': self.file_path_abs,
                    'section': link
                }

                # With original section number.




