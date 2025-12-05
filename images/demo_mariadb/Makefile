.PHONY: backup build_dir

build_dir:
	bin/build.sh

build: build_dir
	docker build -t "demo_mariadb" .

build_done:
	echo "mariadb build done"
