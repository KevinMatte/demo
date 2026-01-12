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
    stderr = res.stderr.decode(encoding="utf-8")
    stdout = res.stdout.decode(encoding="utf-8")
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
            
            If no files are given, uses list of files found by git diff with main or git status.
            
            For new Markdown References, create a reference with just the section's title.
            
            Example 1: Type
                 [Usage](#Usage section)
               will be updated to refer to section 3 with that label:
                 ### Usage section
               and update the reference to something like:
                 [Usage](#5.3-usage-section)
                 
            Example 2: Type
                 [Usage](OtherFile.md#Usage section)
               will be updated to refer to section 3 in OtherFile.md with that label:
                 ### Usage section
               You must include OtherFile.md as a parameter, for this reference to be re-worked.
            
            Note: Use '[[_TOC_]]' to generate the table of contents, not this script.
               
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
    description = "Use all *.md from current directory"
    group.add_argument('--all', '-a', dest='all', action='store_const', const=True, required=False,
                        default=False, help=description)
    description = "Add to git calculated list of changed files the arguments as files."
    group.add_argument('--add', '-A', dest='add_files', action='store_const', const=True, required=False,
                        default=False, help=description)
    description = "List *.md files automatically found or on the command line. Do nothing else"
    group.add_argument('--list_files', '-l', dest='list_files', action='store_const', const=True, required=False,
                        default=False, help=description)
    description = "List ALL files automatically found or on the command line. Do nothing else"
    group.add_argument('--list_all_files', '-L', dest='list_all_files', action='store_const', const=True, required=False,
                        default=False, help=description)
    group = parser.add_argument_group('Sections')
    description = "Indent sections. A CSV list of sections with '=', '-' or '+' to keep, reduce or increase indents"
    group.add_argument('--indent', '-I', dest='indent', nargs=1, required=False,
                        help=description)
    description = "Add section numbers"
    group.add_argument('--section_numbers_add', '-n', dest='add_section_numbers', action='store_const', const=True, required=False,
                        default=False, help=description)
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
    description = "Verbose mode: Describes git actions"
    parser.add_argument('--verbose', '-V', dest='verbose', action='store_const', const=True, required=False,
                        default=False, help=description)
    parser.add_argument('files', help='Markdown File', nargs="*")
    return parser

def create_link_from_text(link_text):
    text = link_text.lower().replace(" ", "-")
    text = re.sub('[() ]', '-', text)
    text = re.sub('[^\w-]', '', text)
    text = text.rstrip("-")
    return text

class MDFile:
    """
    Finds sections and references to sections producing a new list of lines
    with corrected sessions and printing a list of changes or unknown section references.

    Uses results of :func:`create_script_argument_parser`

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
            self.indents = {}

        # A list of numbers, such as 1,2,3 for 1.2.3
        self.current_section = []
        self.max_sec_text_width = 0
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
                    if re.match("^<a id='sec_.*</a>$", line):
                        continue

                    if not self.scan_only:
                        line = self.process_line_refs(line)

                    line = self.process_line_sections(line)

                    # Add section or body line to body.
                    self.body.append(line)
                    if not self.has_change and line != src_line.rstrip():
                        self.has_change = True

    def add_all_abs_ref_set(self, line):
        m = re.match(r"\[(?P<label>[^]]+)]\((?P<file>[.\w\-/]+(.md)?)#.*\)", line)
        if m:
            ref_file_path = self.get_ref_file_path(m.group('file'))
            if exists(ref_file_path):
                self.sections.all_abs_ref_set.add(ref_file_path)

    def process_line_sections(self, line):
        self.add_all_abs_ref_set(line)

        # Check for section line. Ex: ^## A section description.
        m = re.match("^ *(?P<sec>#+)( (?P<retain> *(?P<sec_num_str>[0-9.]+) ))? *(?P<sec_text>.*)", line)
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

            link = create_link_from_text(link_text)
            sec_record = {
                'file': self.file_path_abs,
                'section': link
            }

            # With original section number.
            self.add_section_rec_entry(f"{self.file_path_abs}#{link}", sec_record)
            # With section text
            self.add_section_rec_entry(sec_text, sec_record)

            # Without section numbers.
            link_clean = create_link_from_text(sec_text)
            link_clean = re.sub('[^\w-]', '', link_clean)
            self.add_section_rec_entry(link_clean, sec_record)

            # Add to TOC references to sections
            self.toc.append([sec, f"[{sec_text}](#{link})"])

            # Put blank lines in TOC between section level 1's
            if level == 0 and self.current_section[level] > 1:
                self.toc.append(["", ""])

        return line

    def process_indent_ops(self, sec_num_str, sec_str):
        if sec_num_str in self.indents:
            # If existing line has a section number that is selected in self.args.indents...
            op = self.indents[sec_num_str]
            if op == '=':
                self.indent_op = None
            elif op == '-':
                self.indent_op = -1
                self.indent_sec = sec_num_str
            else:
                self.indent_sec = sec_num_str
                self.indent_op = 1

        elif self.indent_op is not None and self.indent_sec != sec_num_str[0:len(self.indent_sec)]:
            # If the indented section's end has been reached
            self.indent_op = None
        # Add or remove '#'s for section number calculations.
        if self.indent_op == 1:
            sec_str = "#" + sec_str
        elif self.indent_op == -1:
            sec_str = sec_str[1:]
        return sec_str

    def process_line_refs(self, line):
        global num_errors
        ref_expr = "(?P<pre>.*)(?P<match>\[(?P<label>[^]]+)]\((?P<file>[.\w\-/]+(.md)?)?# *(#* )? *((?P<section>[0-9.]+)[ -])? *(?P<link>[^)]+)\))(?P<post>.*)"

        message_prefix = f"{self.file_path}:{self.current_line_no}"
        # Find links to other *.md's
        #                                 [label           ] (file?                     #section              text-lower     )
        m = re.match(ref_expr, line)
        if m:

            new_match_str = ""
            count = 0
            has_change = False
            for ch in m.group('match') + m.group('post'):
                count += 1 if ch == '(' else 0
                has_brace = count > 1 and ch in '()'
                new_match_str += "-" if has_brace else ch
                has_change = has_change or has_brace
                count -= 1 if ch == ')' else 0
            if has_change:
                m = re.match(ref_expr, m.group('pre') + new_match_str)

        if m:
            file_path = m.group('file')
            ref_file_path = self.get_ref_file_path(m.group('file'))

            match_str = m.group('match')
            match_prefix = f"{message_prefix} Reference: '{match_str}'"
            if len(match_prefix) < 40:
                match_prefix_short1 = f"{message_prefix} Replacing:"
                match_prefix_short2 = (' ' * (len(match_prefix_short1) - 5)) + 'with:'
            else:
                match_prefix_short1 = f"    Replacing:"
                match_prefix_short2 = f"         with:"

            # Do not process references outside of known file set.
            if ref_file_path not in self.sections.all_abs_file_set:
                print(f"Skipping {match_prefix} Skipping\n    File outside scope")
                return line

            link = create_link_from_text(m.group('link'))
            link = re.sub('[^\w-]', '', link)
            link = f"{ref_file_path}#{link}"

            if link in self.sections.section_rec_dict:
                s = self.sections.section_rec_dict[link]
            elif m.group('link') in self.sections.section_rec_dict:
                s = self.sections.section_rec_dict[m.group('link')]
            else:
                s = None
                print(f"{match_prefix} Skipping")

            ref_file_rel_path = os.path.relpath(ref_file_path, self.file_path_abs_dir)

            if s is not None:
                has_multiple = False
                if 'multiple' in s:
                    has_multiple = True
                    for sm in s['multiple']:
                        sm_path = os.path.relpath(sm['file'], self.file_path_abs_dir)
                        if sm_path == ref_file_rel_path:
                            has_multiple = False
                            s = sm
                            break
                if has_multiple:
                    print(f"{match_prefix} Multiple solutions found")
                    num_errors += 1
                    for sm in s['multiple']:
                        sm_path = os.path.relpath(sm['file'], self.file_path_abs_dir)
                        print(f"  {sm_path}")
                else:
                    if s['file'] == self.file_path_abs:
                        rec_file_rel_path = file_path if file_path else ""
                    else:
                        rec_file_rel_path = os.path.relpath(s['file'], self.file_path_abs_dir)

                    # Don't change ./ references.
                    if ((not file_path) == (not rec_file_rel_path)) or \
                            (f"./{file_path}" == rec_file_rel_path or f"./{rec_file_rel_path}" == file_path):
                        rec_file_rel_path = file_path if file_path else ""

                    ref_str = f"[{m.group('label')}]({rec_file_rel_path}#{s['section']})"
                    if match_str != ref_str and \
                            match_str != f"[{m.group('label')}]({rec_file_rel_path}.md#{s['section']})":
                        print(f"{match_prefix_short1} {match_str}")
                        print(f"{match_prefix_short2} {ref_str}")
                        line = f"{m.group('pre')}{ref_str}{m.group('post')}"
        else:
            m = re.match("(?P<pre>.*)(?P<match>\[(?P<label>[^]]+)]\((?P<file>[^)#]+)[^)]*\))(?P<post>.*)",
                         line)
            if m:
                match_str = m.group('match')
                ref_file_path = self.get_ref_file_path(m.group('file'))

                if ':' not in match_str and '?' not in match_str and '.pdf' and '(/' not in match_str and not exists(ref_file_path) and not exists(
                        f"{ref_file_path}.md"):
                    match_prefix = f"{message_prefix} Reference: '{match_str}'"
                    print(f"{match_prefix} File not found")
                    num_errors += 1
                    [status, stdout, stderr] = run_shell(f"find . \( -name node_modules -prune \) -o -name '{os.path.basename(ref_file_path)}' -print", exit_on_error=True)
                    if status == 0:
                        files = [file.strip() for file in stdout.split("\n") if file]
                        if files:
                            print("  Options:")
                            abs_file_path = os.path.abspath(self.file_path)
                            for found_file in files:
                                file = os.path.abspath(found_file)
                                common_prefix = os.path.commonprefix([abs_file_path, file])
                                up_parents = "../" * (len(abs_file_path[len(common_prefix):].split("/")) - 1)
                                rel_file = os.path.relpath(file, common_prefix)
                                print(f"    {os.path.join(up_parents, rel_file)}")


        return line

    def get_ref_file_path(self, ref_file):
        """

        :param str ref_file:
        :return: str
        """

        if ref_file is None:
            ref_file_path = os.path.abspath(self.file_path)
        else:
            ref_file_path = os.path.abspath(os.path.join(self.file_path_abs_dir, ref_file))
            if ref_file_path[-3:] != '.md' and not exists(ref_file_path) and exists(
                    f"{ref_file_path}.md"):
                ref_file_path = f"{ref_file_path}.md"

        return ref_file_path

    def add_section_rec_entry(self, dict_key, sec_record):
        sec_record = sec_record.copy()
        if dict_key not in self.sections.section_rec_dict:
            self.sections.section_rec_dict[dict_key] = sec_record
        else:
            existing_sec_rec = self.sections.section_rec_dict[dict_key]
            entries = existing_sec_rec['multiple'] if 'multiple' in existing_sec_rec else [existing_sec_rec]

            found_match = False
            for entry in entries:
                entry_match = True
                for [key, value] in sec_record.items():
                    if value != entry[key]:
                        entry_match = False
                        break
                if entry_match:
                    found_match = True
                    break
            if not found_match:
                if 'multiple' in existing_sec_rec:
                    existing_sec_rec['multiple'].append(sec_record)
                else:
                    existing_sec_rec['multiple'] = [existing_sec_rec.copy(), sec_record]

    def get_lines(self):

        # Write TOC
        if self.sections.args.add_toc and len(self.toc) > 0:
            self.has_change = True
            self.body = [
                            MDFile.tableOfContentsLine,
                            "",
                        ] + [
                            f"{sec:{self.max_sec_text_width}} {line}" for [sec, line] in self.toc
                        ] + ["", "---"] + self.body
        return self.body


class MDSections:
    def __init__(self):

        parser = create_script_argument_parser()
        self.args = parser.parse_args()
        self.section_rec_dict = {}
        self.all_abs_file_set = set()
        self.all_abs_ref_set = set()
        self.retain_sections = not self.args.add_section_numbers and not self.args.remove_section_numbers

    def main(self):
        has_changelog = False
        for f in sys.argv:
            if f == 'CHANGELOG.md':
                has_changelog = True
                break

        list_files = self.args.list_files or self.args.list_all_files

        if self.args.all:
            [status, stdout, stderr] = run_shell(r"find . \( -name node_modules -prune \) -o -name '*.md' -print", True)
            files = []
            for file in stdout.split("\n"):
                file = file.strip()
                if file:
                    files.append(file)
            if not files:
                if  not list_files:
                    print("No files found to process")
                exit(0)
        elif not self.args.add_files:
            files = self.args.files
        else:
            files = []

        if not files:
            [status, stdout, stderr] = run_shell(r"git diff --name-only main .", True)
            if status == 0:
                files = [file.strip() for file in stdout.split("\n") if file and (self.args.list_all_files or file.endswith('.md'))]
            if files and (self.args.verbose or not list_files):
                if self.args.verbose:
                    print("git diff --name-only main .")
                print("Reviewing git changes from main:\n  " + "\n  ".join(files))
        if not files:
            [status, stdout, stderr] = run_shell(r"git status --short | grep -v '^??' | sed -e 's/.* \([^ ]*\)/\1/'", True)
            if status == 0:
                files = [file.strip() for file in stdout.split("\n") if file and (self.args.list_all_files or file.endswith('.md'))]
            if files and (self.args.verbose or not list_files):
                if self.args.verbose:
                    print("git status --short | grep -v '^??' | sed -e 's/.* \([^ ]*\)/\1/'")
                print("Reviewing git status change list:\n  " + "\n  ".join(files))
        if self.args.add_files:
            files.extend(self.args.files)
        if not files:
            if  not list_files:
                print("No files found to process")
            exit(0)

        all_file_set = set()
        self.all_abs_file_set = set()
        for file_glob in files:
            for file_path in glob.glob(file_glob):
                if '/node_modules/' in file_path:
                    continue
                if not has_changelog and file_path == 'CHANGELOG.md':
                    if not list_files:
                        print(f"Skipping {file_path}")
                    continue

                all_file_set.add(file_path)
                self.all_abs_file_set.add(os.path.abspath(file_path))

                if list_files:
                    continue

                # Make backup
                if not self.args.stdout and not self.args.validate and self.args.backup:
                    shutil.copyfile(file_path, f"{file_path}.bak")

                md_file = MDFile(self, file_path, scan_only=True)
                md_file.parse()

        if list_files:
            print("\n".join(all_file_set))
            exit(0)

        # Scan all files referenced, but not include in file list.
        external_files = self.all_abs_ref_set.difference(self.all_abs_file_set)
        if external_files:
            print(f"Reading sections for external files:")
            for file_path in external_files:
                print(f"  {os.path.relpath(file_path)}")
                self.all_abs_file_set.add(file_path)
                md_file = MDFile(self, file_path, scan_only=True, is_external_file=True)
                md_file.parse()

        for file_path in all_file_set:
            md_file = MDFile(self, file_path, False)
            md_file.parse()

            lines = md_file.get_lines()

            if md_file.has_change and not self.args.validate:
                if self.args.stdout:
                    # echo results
                    output = sys.stdout
                else:
                    # The current file (with a -i)
                    output = open(file_path, 'w')
                output.write("\n".join(lines) + "\n")
                output.close()


md_table_of_contents = MDSections()
md_table_of_contents.main()
if num_errors > 0:
    print(f"{num_errors} errors found.")
    exit(1)
else:
    print("No errors found")
    exit(0)
