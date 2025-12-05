-include .env

.PHONY: build_clean build build_static build_src

build_clean:
	rm -fr build
	mkdir build

build_static:
	rm -fr build
	cp -pr static build

build: build_static
