.PHONY: build_clean backup build_dir build_cmake build build_init

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

build_clean: build_init
	rm -fr build tmp

build_dir:
	bin/build.sh

SRC=$(wildcard src/*.cpp)
OBJ=$(patsubst %.cpp,%.o,$(SRC))

build_cmake:
	mkdir -p build/home/_user_
	mkdir -p cmake_build
	cmake -B cmake_build -DCMAKE_BUILD_TYPE:STRING=Debug
	cmake --build cmake_build --target all

build: build_dir build_cmake
	. ${PROJ_ROOT}/.env; docker build -t "demo_cpp" .

build_done:
	rm -f tmp/build.locked
