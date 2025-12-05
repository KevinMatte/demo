-include .env

.PHONY: all www venv build build_static update_image_build build_done build_init build_src retrieve_builds

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_init:
	touch $(PROJ_ROOT)/tmp/build.locked

build_clean: build_init
	rm -fr build
	mkdir -p build/var/www/html/static
	mkdir -p build/var/www
	for app in $$(echo ${DEMO_UI_APPS}); do echo "app: $${app}"; $(MAKE) -C apps/$${app} build_clean; done


retrieve_builds:
	for app in $$(echo ${DEMO_UI_APPS}); do \
  		$(MAKE) -C apps/$${app} build; \
		tar cf - -C apps/$${app}/build . | (cd build; tar xvf -); \
  	done

update_image_build: build_init retrieve_builds
	bin/update_build.sh
	for app in $$(echo ${DEMO_UI_APPS}); do \
  		echo "${app}"; \
		if [ -e apps/$${app}/bin/update_demo_ui_build.sh ]; then \
		  	apps/$${app}/bin/update_demo_ui_build.sh; \
		fi \
  	done

build_done:
	rm -f tmp/build.locked

build_mounted: update_image_build build_done
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build; done

build_static:
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build_static; done

build_src:
	for app in $$(echo ${DEMO_UI_APPS}); do $(MAKE) -C apps/$${app} build_src; done

build: build_clean update_image_build
	docker build -t "demo_ui" .

clean:
	rm -fr bin/venv tmp/*

test:
	for app in $$(echo ${DEMO_UI_APPS}); do echo $${app}; done


