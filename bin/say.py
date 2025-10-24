#!bin/venv/bin/python

import sys
from gtts import gTTS
import os 

global ARGV

mytext=" ".join(sys.argv[2:])
file_name = sys.argv[1]

language = 'en'
myobj = gTTS(text=mytext, lang=language, slow=False)
myobj.save(file_name)
# os.system(f"play {file_name} tempo 1.9")
os.system(f"play {file_name} tempo 1.9")
