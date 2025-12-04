.PHONY: build_clean build

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_clean:
	rm -fr node_modules dist
	npm install
	rm -fr build
	mkdir build

build:
	#[ -d src/static ] && tar cf - -C src/static . | (cd build; tar xvf -)
	npx vite build --outDir build/var/www/html/animation
