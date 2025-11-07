
.PHONY: all www venv build build_static build_front build_done build_init tag

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

build_clean: build_init
	rm -fr build
	mkdir -p build/var/www/html/static
	mkdir -p build/var/www
	cd src/front; npm install



build_static: build_init
	tar cf - -C src/static . | (cd build; tar xvf -)
	. ${PROJ_ROOT}/.env; \
	echo ${DEMO_UI_VERSION} > build/var/www/html/static/version.txt; \
	set | grep '^DEMO_.*\(\(VERSION\)\|\(DATE\)\)' > build/var/www/html/static/versions.txt

build_front: build_init
	cd src/front; npx vite build --outDir ../../build/var/www/html

build_done:
	rm -f tmp/build.locked

build_mounted: build_static build_front build_done

build: build_clean build_static build_front
	docker build -t "demo_ui" .

clean:
	rm -fr bin/venv tmp/*

test_make:
	@pwd
	@npm -v
	@node -v
