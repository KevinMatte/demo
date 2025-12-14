-include .env

.PHONY: build_clean build build_static build_src

build_clean:
	rm -fr node_modules dist
	pnpm install
	rm -fr build
	mkdir build

build_static:
	tar cf - -C static . | (cd build; tar xvf -)

build_src:
	npx vite build --outDir build/var/www/html/playground

build: build_static build_src
