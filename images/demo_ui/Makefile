
.PHONY: all www venv build build_static build_apps build_done build_init tag

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

build_clean: build_init
	rm -fr build
	mkdir -p build/var/www/html/static
	mkdir -p build/var/www
	$(MAKE) -C apps/homepage build_clean
	$(MAKE) -C apps/playground build_clean



build_apps: build_init
	$(MAKE) -C apps/homepage build
	tar cf - -C apps/homepage/build . | (cd build; tar xvf -)
	$(MAKE) -C apps/playground build
	tar cf - -C apps/playground/build . | (cd build; tar xvf -)
	bin/update_build.sh
	apps/playground/bin/update_demo_ui_build.sh

build_done:
	rm -f tmp/build.locked

build_mounted: build_static build_apps build_done
	$(MAKE) -C apps/playground build

build: build_clean build_static build_apps
	docker build -t "demo_ui" .

clean:
	rm -fr bin/venv tmp/*

test_make:
	@pwd
	@npm -v
	@node -v
