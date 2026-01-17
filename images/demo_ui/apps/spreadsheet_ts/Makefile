-include .env

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

.PHONY: clean
clean:
	rm -fr node_modules dist
	rm -fr build

.PHONY: build_static

.PHONY: build_src
	@echo "make build_static"
	if [ -d static ]; then tar cf - -C static . | (cd build; tar xvf -); fi
	pnpm build --outDir build/var/www/html/spreadsheet_ts

.PHONY: build
build:
	pnpm install
	mkdir build

.PHONY: spreadsheet_js_dev
	pnpm run dev --port 5173
