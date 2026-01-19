-include .env

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

.PHONY: clean
clean:
	rm -fr node_modules dist
	rm -fr build

node_modules:
	pnpm install

.PHONY: build_static
build_static:

.PHONY: build_src
build_src: node_modules
	mkdir -p build
	echo "make build_src"
	if [ -d static ]; then tar cf - -C static . | tar xvf - -C build; fi
	pnpm build --outDir build/var/www/html/animation

.PHONY: build
build: build_static build_src

.PHONY: dev
dev: node_modules
	pnpm run dev --port 5173
