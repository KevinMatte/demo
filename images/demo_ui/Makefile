-include .env

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

.PHONY: build_init
build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

.PHONY: clean
clean: build_init
	rm -fr build
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do echo "app: $${app}"; $(MAKE) -C apps/$${app} clean; done



.PHONY: retrieve_builds
retrieve_builds:
	set -ex; \
	rm -fr build; mkdir build; \
	for app in $$(echo ${DEMO_UI_APPS}); do \
  		$(MAKE) -C apps/$${app} build; \
		tar cf - -C apps/$${app}/build . | tar xf - -C build; \
  	done

.PHONY: update_image_build
update_image_build: build_init retrieve_builds
	mkdir -p build/var/www/html/static
	mkdir -p build/var/www
	bin/update_build.sh
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do \
  		echo "${app}"; \
		if [ -e apps/$${app}/bin/update_build.sh ]; then \
		  	apps/$${app}/bin/update_build.sh; \
		fi \
  	done

.PHONY: build_done
build_done:
	rm -f tmp/build.locked

.PHONY: build_mounted
build_mounted: update_image_build build_done
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build; done

.PHONY: build_static
build_static:
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build_static; done

.PHONY: build_src
build_src:
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build_src; done

.PHONY: build
build: clean update_image_build
	docker build -t "demo_ui" .

.PHONY: test
test:
	set -e; \
	for app in $$(echo ${DEMO_UI_APPS}); do echo $${app}; done


