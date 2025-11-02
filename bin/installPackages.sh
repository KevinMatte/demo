#!/bin/bash

# =======================
# External install instructions
# -------------
# For docker engine:
#   see https://docs.docker.com/engine/install/ubuntu/
#   see https://docs.docker.com/engine/install/linux-postinstall/
#
# For nodejs see: https://nodesource.com/products/distributions

# =======================
# For Framework
#  For 'play' used by say.py
# -------------
sudo apt update
sudo apt install -y make sox libsox-fmt-mp3

# =======================
# For demo_ui
# -------------
sudo apt update
sudo apt install -y python3 python3-venv python-is-python3

# =======================
# For demo_cpp
# -------------
sudo apt update
sudo apt -y install g++ cmake build-essential gdb ninja-build
sudo apt install -y libasio-dev
#   QT Creator: https://www.qt.io/download-qt-installer-oss
#     STD CPP Help: https://www.creatis.insa-lyon.fr/~grenier/?p=273
#        Save at /opt/qt/cppreference-doc-en-cpp.qch

# =======================
# The following were installed on dev1, but not dev2, so they are probably not needed:
# -------------
#sudo apt install -y libxcb-cursor0 libxcb-cursor-dev
#sudo apt install -y libboost-atomic-dev libboost-thread-dev libboost-system-dev \
#  libboost-date-time-dev libboost-regex-dev libboost-filesystem-dev libboost-random-dev \
#  libboost-chrono-dev libboost-serialization-dev
#sudo apt install -y libwebsocketpp-dev openssl libssl-dev
#sudo apt install libssl-dev libcrypto++-dev
#sydo apt install libboost-all-dev





