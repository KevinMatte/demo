.PHONY: build_clean build

build_clean:
	rm -fr build
	mkdir build

build:
	tar cf - -C src . | (cd build; tar xvf -)