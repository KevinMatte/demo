#!/bin/bash

# For docker engine:
#   see https://docs.docker.com/engine/install/ubuntu/
#   see https://docs.docker.com/engine/install/linux-postinstall/
# For nodejs see: https://nodesource.com/products/distributions

# For Framework
#  For 'play' used by say.py
sudo apt update
sudo apt install -y make sox libsox-fmt-mp3

# For demo_ui
sudo apt update
sudo apt install -y python3 python3-venv python-is-python3

# Fpr demo_cpp
# Installed Qt tools from: https://www.qt.io/download-qt-installer-oss
sudo apt update
sudo apt -y install g++ cmake build-essential gdb
sudo apt install -y libasio-dev

# sudo apt install -y libxcb-cursor0 libxcb-cursor-dev
# sudo apt install -y qtcreator qtbase5-dev qt5-qmake

#sudo apt install -y libboost-atomic-dev libboost-thread-dev libboost-system-dev \
#  libboost-date-time-dev libboost-regex-dev libboost-filesystem-dev libboost-random-dev \
#  libboost-chrono-dev libboost-serialization-dev
#
#sudo apt install -y libwebsocketpp-dev openssl libssl-dev ninja-build
#sudo apt install libssl-dev libcrypto++-dev
#sydo apt install libboost-all-dev





