#!/bin/bash

c="$(printf "%s" "$1" | sed -e 's/[^.]//g' | wc -c)"
name="$(echo "$1" | cut -d '.' -f-"$c")"
output="${name}.mov"
[ "$output" = "$1" ] && output="${name}_new.mov"
ffmpeg -i "$1" -fps_mode cfr -f mov "${output}"
