.PHONY: backup build_dir

PROJ_ROOT="$$(git rev-parse --show-toplevel)"

build_dir:
	bin/build.sh

build: build_dir
	. ${PROJ_ROOT}/.env; docker build -t "demo_java" -f Dockerfile .

build_run: build
	-docker kill demo_java
	docker run -d --rm -p 58443:8443 -p 58080:8080 --name demo_java demo_java

build_done:
	echo "demo_java build done"
