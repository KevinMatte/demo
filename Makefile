include .env
export

.PHONY: venv build local localMounted update_dot_env build_done version_bump

clean:
	$(MAKE) -C images/demo_ui build_clean
	$(MAKE) -C images/demo_cpp build_clean

# ---------------------------
# Build framework targets
# ---------------------------
tmp/venv.timestamp: bin/requirements.txt
	if [ \! -d bin/venv ]; then \
	   python3 -m venv bin/venv; \
	fi
	. bin/venv/bin/activate && \
	   pip install -r bin/requirements.txt;
	touch tmp/venv.timestamp;

update_dot_env: bin/generateDotEnv.sh
	bin/generateDotEnv.sh .env

# ---------------------------
# Build targets
# ---------------------------
build: tmp/venv.timestamp update_dot_env
	$(MAKE) -C images/demo_ui build
	$(MAKE) -C images/demo_cpp build
	$(MAKE) -C images/demo_mariadb build
	$(MAKE) -C images/demo_java build

# Finalizes/cleans up build.
build_done:
	$(MAKE) -C images/demo_cpp build_done
	$(MAKE) -C images/demo_mariadb build_done
	$(MAKE) -C images/demo_java build_done

# ---------------------------
# Development targets
# ---------------------------

local: build
	-docker compose kill 2>/dev/null || echo "Pass: services not running"
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml local
	docker compose up --no-build --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"

# Local run with mounted volume:
localMounted: build
	-docker compose kill 2>/dev/null || echo "Pass: services not running"
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml mounted
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"


# ---------------------------
# Publish to public target
# ---------------------------

publish_remove_images:
	ssh demo_prod "docker image rm $$(docker image ls | grep localhost | sed -e 's/  */:/g' | cut -d':' -f1,2,3)"

version_bump:
	bin/bumpVersion.sh
	bin/generateDotEnv.sh

publish: version_bump build
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	$(MAKE) -C images/demo_ui tag
	ssh demo_prod mkdir -p dev/demo.prod
	scp tmp/docker-compose.yaml demo_prod:dev/demo.prod
	scp .env demo_prod:dev/demo.prod/.env
	set -x; vers=$$(cat src/docker/demo_version.txt); \
	docker tag demo_ui:latest localhost:5000/demo_ui:$${vers}; \
	docker tag demo_cpp:latest localhost:5000/demo_cpp:$${vers}; \
	docker tag demo_mariadb:latest localhost:5000/demo_mariadb:$${vers}; \
	docker tag demo_java:latest localhost:5000/demo_java:$${vers}; \
	docker push localhost:5000/demo_ui:$${vers}; \
	docker push localhost:5000/demo_cpp:$${vers}; \
	docker push localhost:5000/demo_mariadb:$${vers}; \
	docker push localhost:5000/demo_java:$${vers};

	ssh demo_prod "cd dev/demo.prod; docker compose up  --remove-orphans --detach"
	rm -f tmp/build.locked
	@echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"


