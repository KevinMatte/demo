.PHONY: backup build_dir

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_dir:
	bin/build.sh

build: build_dir
	. ${PROJ_ROOT}/.env; docker build -t "demo_mariadb" .

build_done:
	echo "mariadb build done"
