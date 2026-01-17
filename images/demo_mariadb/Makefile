.PHONY: clean
clean:
	rm -fr build

.PHONY: build_dir
build_dir:
	bin/build.sh

.PHONY: build
build: build_dir
	docker build -t "demo_mariadb" .

.PHONY: build_done
build_done:
	echo "mariadb build done"
