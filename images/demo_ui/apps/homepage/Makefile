-include .env

.PHONY: build_clean build build_static build_src

build_clean:
	rm -fr build
	mkdir build

build_static:
	tar cf - -C static . | (cd build; tar xvf -)

build: build_static