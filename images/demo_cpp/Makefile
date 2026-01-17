.PHONY:

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

.PHONY: build_init
build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

.PHONY: clean
clean: build_init
	rm -fr build tmp

.PHONY: build_dir
build_dir:
	bin/build.sh

SRC=$(wildcard src/*.cpp)
OBJ=$(patsubst %.cpp,%.o,$(SRC))

.PHONY: build_cmake
build_cmake:
	mkdir -p build/home/_user_
	mkdir -p cmake_build
	cmake -B cmake_build -DCMAKE_BUILD_TYPE:STRING=Debug
	cmake --build cmake_build --target all

.PHONY: build
build: build_dir build_cmake
	docker build -t "demo_cpp" .

.PHONY: build_done
build_done:
	rm -f tmp/build.locked
