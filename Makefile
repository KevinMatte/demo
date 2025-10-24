

.PHONY: venv build compose_kill local localMounted

clean:
	$(MAKE) -C images/demo_ui build_clean

build:
	bin/generateDotEnv.sh .env
	$(MAKE) -C images/demo_ui build

compose_kill:
	-docker compose kill 2>/dev/null || echo "Pass: services not running"

local: build compose_kill
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml local
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"
	@echo "or Run: docker exec -it demo_ui bash"

# Local run with mounted volume:
localMounted: build compose_kill
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml mounted
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"
	@echo "or Run: docker exec -it demo_ui bash"



publish: build
	$(MAKE) -C images/demo_ui tag
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	scp tmp/docker-compose.yaml demo_prod:dev/demo
	scp .env demo_prod:dev/demo/.env
	set -x; vers=$$(cat images/demo_ui/src/docker/demo_version.txt); \
	docker tag demo_ui:$${vers} localhost:5000/demo_ui:$${vers}; \
	docker push localhost:5000/demo_ui:$${vers}; \
	ssh demo_prod "docker pull localhost:5000/demo_ui:$${vers}"
	ssh demo_prod "cd dev/demo; docker compose up  --remove-orphans --detach"
	rm -f tmp/build.locked
	@echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"

venv: tmp/venv.timestamp

tmp/venv.timestamp: bin/requirements.txt
	if [ \! -d bin/venv ]; then \
	   python3 -m venv bin/venv; \
	fi
	. bin/venv/bin/activate && \
	   pip install -r bin/requirements.txt;
	touch tmp/venv.timestamp;

test:
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
