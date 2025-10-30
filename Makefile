include .env
export

.PHONY: venv build local localMounted update_dot_env build_done

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

.env: bin/generateDotEnv.sh
	bin/generateDotEnv.sh .env

# ---------------------------
# Build targets
# ---------------------------
build: tmp/venv.timestamp .env
	$(MAKE) -C images/demo_ui build
	$(MAKE) -C images/demo_cpp build
	$(MAKE) -C images/demo_mariadb build

# Finalizes/cleans up build.
build_done:
	$(MAKE) -C images/demo_cpp build_done
	$(MAKE) -C images/demo_mariadb build_done

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

publish: build
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	$(MAKE) -C images/demo_ui tag
	ssh demo_prod mkdir -p dev/demo.prod
	scp tmp/docker-compose.yaml src/common.Makefile src/publish/Makefile demo_prod:dev/demo.prod
	scp .env demo_prod:dev/demo.prod/.env
	set -x; vers=$$(cat images/demo_ui/src/docker/demo_version.txt); \
	docker tag demo_ui:$${vers} localhost:5000/demo_ui:$${vers}; \
	docker tag demo_cpp:$${vers} localhost:5000/demo_cpp:$${vers}; \
	docker push localhost:5000/demo_ui:$${vers}; \
	docker push localhost:5000/demo_cpp:$${vers}; \
	ssh demo_prod "docker pull localhost:5000/demo_ui:$${vers}" \
	ssh demo_prod "docker pull localhost:5000/demo_cpp:$${vers}"
	# TBD: The docker pull line may not be needed. docker compose up should get it.

	ssh demo_prod "cd dev/demo.prod; docker compose up  --remove-orphans --detach"
	rm -f tmp/build.locked
	@echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"


