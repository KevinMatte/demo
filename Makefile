-include .env
export

.PHONY: clean
clean:
	$(MAKE) -C images/demo_ui build_clean
	$(MAKE) -C images/demo_cpp build_clean

.PHONY: checkDocker
checkDocker:
	@if docker ps > /dev/null 2>/dev/null; then :; else \
	  echo "==========================="; \
	  echo "Docker Engine is not active"; \
	  echo "---------------------------"; \
	  echo "Run: $$(pwd)/bin/dockerSetup.sh (or $$(pwd)/bin/devSetup.sh for localMounted file monitoring)"; \
	  exit 1; \
	fi

# ---------------------------
# Build framework targets
# ---------------------------

.PHONY: git_good
git_good:
	@if test -n "$$(git status -s)"; then \
  		echo "git status is not clean"; \
  		git status -s; \
  		exit 1; \
  	fi

.PHONY: pre_build
pre_build: checkDocker
	bin/checkJSXReferences.sh

tmp/venv.timestamp: bin/requirements.txt
	if [ \! -d bin/venv ]; then \
	   python3 -m venv bin/venv; \
	fi
	. bin/venv/bin/activate && \
	   pip install -r bin/requirements.txt;
	touch tmp/venv.timestamp;

.PHONY: generateDotEnv.sh
generateDotEnv.sh: bin/generateDotEnv.sh
	bin/generateDotEnv.sh .env

.PHONY: update_dot_env
update_dot_env: generateDotEnv.sh

# ---------------------------
# Build targets
# ---------------------------
.PHONY: build
build: pre_build tmp/venv.timestamp
	$(MAKE) -C images/demo_ui build
	$(MAKE) -C images/demo_cpp build
	$(MAKE) -C images/demo_mariadb build
	$(MAKE) -C images/demo_java build

# Finalizes/cleans up build.
.PHONY: build_done
build_done:
	$(MAKE) -C images/demo_cpp build_done
	$(MAKE) -C images/demo_mariadb build_done
	$(MAKE) -C images/demo_java build_done

# ---------------------------
# Development targets
# ---------------------------

.PHONY: local
local: generateDotEnv.sh
	-docker compose kill 2>/dev/null || echo "Pass: services not running"
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml local
	${MAKE} -C . build
	docker compose up --no-build --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"

.PHONY: local_test
local_test: git_good local

# Local run with mounted volume:
.PHONY: localMounted
localMounted: generateDotEnv.sh
	-docker compose kill 2>/dev/null || echo "Pass: services not running"
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml mounted
	${MAKE} -C . build
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"


# ---------------------------
# Publish to public target
# ---------------------------

.PHONY: publish_remove_images
publish_remove_images:
	ssh demo_prod "docker image rm $$(docker image ls | grep localhost | sed -e 's/  */:/g' | cut -d':' -f1,2,3)"

.PHONY: generate_dotEnv
generate_dotEnv:
	bin/generateDotEnv.sh


.PHONY: version_bump
version_bump: git_good build
	# Make sure all files are committed.
	bin/bumpVersion.sh
	bin/publishVersion.sh

.PHONY: publish_push
publish_push:
	ssh demo_prod mkdir -p dev/demo.prod
	scp tmp/docker-compose.yaml tmp/version_data.tar bin/publishVersion.sh demo_prod:dev/demo.prod
	scp .env demo_prod:dev/demo.prod/.env
	tag="v$${DEMO_UI_VERSION}"; git tag $${tag} 2>/dev/null && git push origin $${tag} || :
	docker tag demo_ui:latest localhost:5000/demo_ui:$${DEMO_UI_VERSION};
	docker tag demo_cpp:latest localhost:5000/demo_cpp:$${DEMO_CPP_VERSION};
	docker tag demo_mariadb:latest localhost:5000/demo_mariadb:$${DEMO_MARIADB_VERSION};
	docker tag demo_java:latest localhost:5000/demo_java:$${DEMO_JAVA_VERSION};
	docker push localhost:5000/demo_ui:$${DEMO_UI_VERSION};
	docker push localhost:5000/demo_cpp:$${DEMO_CPP_VERSION};
	docker push localhost:5000/demo_mariadb:$${DEMO_MARIADB_VERSION};
	docker push localhost:5000/demo_java:$${DEMO_JAVA_VERSION};

	ssh demo_prod "cd dev/demo.prod && ./publishVersion.sh version_data.tar && docker compose up  --remove-orphans --detach"
	rm -f tmp/build.locked

.PHONY: publish
publish: version_bump generate_dotEnv
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	$(MAKE) build publish_push
	docker kill version_update 2>/dev/null || :;
	@echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"

