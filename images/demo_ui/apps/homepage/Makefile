.PHONY: build_clean build

build_clean:
	rm -fr build
	mkdir build

build:
	tar cf - -C src/static . | (cd build; tar xvf -)