-include .env

.PHONY: clean
clean:
	rm -fr build

.PHONY: build_static
build_static:
	@echo "make build_static"
	rm -fr build
	mkdir build
	if [ -d static ]; then tar cf - -C static . | (cd build; tar xvf -); fi

.PHONY: build
build: build_static