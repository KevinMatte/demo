#!/bin/bash

# Make sure <*Anchor /> paths in *.jsx files point to a file.

res=0
refs="$(find . -name '*.jsx' -print0 2>/dev/null |
 xargs -0 grep -h 'path="[a-z]' |
 sed -e 's/path="/\npath="/g' | grep '^path="' |
  sed -e 's/.*path="//' -e 's/".*//' |
   grep -v https: |
    sort -u)"
for r in $refs; do
  if [ \! -e "$r" ]; then
    echo "Bad reference: $r"
    res=1
  fi
done
exit $res
