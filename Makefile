include .env
export

.PHONY: venv build compose_kill local localMounted update_dot_env build_done

clean:
	$(MAKE) -C images/demo_ui build_clean

update_dot_env:
	bin/generateDotEnv.sh .env

build_done:
	$(MAKE) -C images/demo_ui build_done
	$(MAKE) -C images/demo_mariadb build_done

build: update_dot_env
	$(MAKE) -C images/demo_ui build
	$(MAKE) -C images/demo_mariadb build

compose_kill:
	-docker compose kill 2>/dev/null || echo "Pass: services not running"

local: build compose_kill
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml local
	docker compose up --no-build --remove-orphans --detach
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
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	$(MAKE) -C images/demo_ui tag
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
	$(MAKE) -C images/demo_mariadb build

backup:
	docker compose exec demo_mariadb bash -c "rm -fr /backup/*"
	docker compose exec demo_mariadb ls /backup
	docker compose exec demo_mariadb mariadb-backup --backup --target-dir=/backup/

restore:
	-docker compose stop demo_mariadb
	docker compose run demo_mariadb mariadb-backup --prepare --target-dir=/backup/
	docker compose run demo_mariadb bash -c "rm -fr /var/lib/mysql/* /var/lib/mysql/.*"
	docker compose run demo_mariadb mariadb-backup --copy-back --target-dir=/backup/
	docker compose start demo_mariadb

clean_docker:
	docker system prune -a