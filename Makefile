-include .env
export

.PHONY: venv build pre_build local localMounted update_dot_env build_done generate_dotEnv version_bump
.PHONY: checkDocker

clean:
	$(MAKE) -C images/demo_ui build_clean
	$(MAKE) -C images/demo_cpp build_clean

checkDocker:
	@if docker ps > /dev/null 2>/dev/null; then :; else \
	  echo "==========================="; \
	  echo "Docker Engine is not active"; \
	  echo "---------------------------"; \
	  exit 1; \
	fi

# ---------------------------
# Build framework targets
# ---------------------------
pre_build: checkDocker
	bin/checkJSXReferences.sh

tmp/venv.timestamp: bin/requirements.txt
	if [ \! -d bin/venv ]; then \
	   python3 -m venv bin/venv; \
	fi
	. bin/venv/bin/activate && \
	   pip install -r bin/requirements.txt;
	touch tmp/venv.timestamp;

generateDotEnv.sh: bin/generateDotEnv.sh
	bin/generateDotEnv.sh .env

# ---------------------------
# Build targets
# ---------------------------
build: pre_build tmp/venv.timestamp update_dot_env
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

generate_dotEnv:
	bin/generateDotEnv.sh

version_bump:
	bin/bumpVersion.sh

publish: version_bump generate_dotEnv build
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	$(MAKE) -C images/demo_ui tag
	ssh demo_prod mkdir -p dev/demo.prod
	scp tmp/docker-compose.yaml demo_prod:dev/demo.prod
	scp .env demo_prod:dev/demo.prod/.env
	set -x; . ./.env; \
	docker tag demo_ui:latest localhost:5000/demo_ui:$${DEMO_UI_VERSION}; \
	docker tag demo_cpp:latest localhost:5000/demo_cpp:$${DEMO_CPP_VERSION}; \
	docker tag demo_mariadb:latest localhost:5000/demo_mariadb:$${DEMO_MARIADB_VERSION}; \
	docker tag demo_java:latest localhost:5000/demo_java:$${DEMO_JAVA_VERSION}; \
	docker push localhost:5000/demo_ui:$${DEMO_UI_VERSION}; \
	docker push localhost:5000/demo_cpp:$${DEMO_CPP_VERSION}; \
	docker push localhost:5000/demo_mariadb:$${DEMO_MARIADB_VERSION}; \
	docker push localhost:5000/demo_java:$${DEMO_JAVA_VERSION};

	ssh demo_prod "cd dev/demo.prod; docker compose up  --remove-orphans --detach"
	rm -f tmp/build.locked
	@echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"


