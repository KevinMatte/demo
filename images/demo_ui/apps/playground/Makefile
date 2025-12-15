-include .env

.PHONY: build_clean build build_static build_src spreadsheet_js_dev

build_clean:
	rm -fr node_modules dist
	pnpm install
	rm -fr build
	mkdir build

build_static:
	tar cf - -C static . | (cd build; tar xvf -)

build_src:
	pnpm build --outDir build/var/www/html/playground

build: build_static build_src

playground_dev:
	pnpm run dev --port 5173
