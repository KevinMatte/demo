-include .env

.PHONY: clean
clean:
	rm -fr node_modules dist
	rm -fr build

node_modules:
	pnpm install

.PHONY: build_static
build_static:
	@echo "make build_static"
	if [ -d static ]; then tar cf - -C static . | (cd build; tar xvf -); fi

.PHONY: build_src
build_src: node_modules
	pnpm build --outDir build/var/www/html/playground

.PHONY: build
build: build_static build_src

.PHONY: playground_dev
playground_dev: node_modules
	pnpm run dev --port 5173
