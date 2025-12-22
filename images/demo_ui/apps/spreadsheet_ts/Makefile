-include .env

.PHONY: build_clean build build_static build_src spreadsheet_js_dev

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_clean:
	rm -fr node_modules dist
	pnpm install
	rm -fr build
	mkdir build

build_static:

build_src:
	#[ -d static ] && tar cf - -C static . | (cd build; tar xf -)
	pnpm build --outDir build/var/www/html/spreadsheet_ts

build: build_static build_src

spreadsheet_js_dev:
	pnpm run dev --port 5173
