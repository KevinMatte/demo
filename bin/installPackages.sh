#!/bin/bash

# For docker engine:
#   see https://docs.docker.com/engine/install/ubuntu/
#   see https://docs.docker.com/engine/install/linux-postinstall/
# For nodejs see: https://nodesource.com/products/distributions


sudo apt install python3
sudo apt install python3-venv
sudo apt install python-is-python3
sudo apt install make
# For 'play' used by say.py
sudo apt install sox
sudo apt-get install libsox-fmt-mp3

# Fpr demo_cpp
# Installed Qt tools from: https://www.qt.io/download-qt-installer-oss
sudo apt install g++
sudo apt update
sudo apt install libxcb-cursor0 libxcb-cursor-dev
sudo apt install -y qtcreator qtbase5-dev qt5-qmake cmake build-essential gdb g++

sudo apt purge -y qtcreator qtbase5-dev qt5-qmake




