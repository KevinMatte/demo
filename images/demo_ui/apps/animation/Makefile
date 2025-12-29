-include .env

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

.PHONY: build_clean
build_clean:
	rm -fr node_modules dist
	pnpm install
	rm -fr build
	mkdir build

build_static:

.PHONY: build_src
build_src:
	[ -d static ] && tar cf - -C static . | (cd build; tar xvf -)
	pnpm build --outDir build/var/www/html/animation

.PHONY: build
build: build_static build_src

.PHONY: animation_dev
animation_dev:
	pnpm run dev --port 5173
