.PHONY: clean
clean:
	rm -fr dist node_modules

.PHONY: build_dir
build_dir:
	bin/build.sh

.PHONY: build
build: build_dir
	docker build -t "demo_nodejs" .

.PHONY: build_done
build_done:
	echo "mariadb build done"
