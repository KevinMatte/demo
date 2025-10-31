.PHONY: build_clean backup build_dir build_cmake build build_init

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

build_clean: build_init
	rm -fr build tmp

build_dir: build_init
	bin/build.sh

SRC=$(wildcard src/*.cpp)
OBJ=$(patsubst %.cpp,%.o,$(SRC))

build_cmake: build_init
	mkdir -p build
	cmake -B tmp -DCMAKE_BUILD_TYPE:STRING=Debug
	cmake --build tmp --target all
	cp tmp/demo_cpp build/demo_cpp

build: build_dir build_cmake
	. ${PROJ_ROOT}/.env; docker build -t "demo_cpp" .

build_done:
	rm -f tmp/build.locked
