
.PHONY: all www venv build build_static build_front build_done tag

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_clean:
	touch tmp/build.locked
	rm -fr build
	mkdir -p build/var/www


build_static:
	touch tmp/build.locked
	tar cf - -C src/static . | (cd build; tar xvf -)

build_front:
	touch tmp/build.locked
	cd src/front; npx vite build --outDir ../../build/var/www/html

build_done:
	rm -f tmp/build.locked

build_mounted: build_static build_front build_done

build: build_clean build_static build_front
	docker build -t "demo_ui" .

tag:
	bin/bumpVersion.sh
	docker tag demo_ui:latest "demo_ui:$$(cat src/docker/demo_version.txt)"

clean:
	rm -fr bin/venv tmp/*

test_make:
	@pwd
	@echo "PROJ_ROOT=${PROJ_ROOT}"
