.PHONY: build_clean build

build_clean:
	rm -fr node_modules dist
	npm install
	rm -fr build
	mkdir build

build:
	tar cf - -C src/static . | (cd build; tar xvf -)
	npx vite build --outDir build/var/www/html/playground
