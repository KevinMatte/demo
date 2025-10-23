
.PHONY: all www venv stop_container build build_static build_front build_done

build_clean:
	touch tmp/build.locked
	rm -fr build
	mkdir -p build/var/www


build_static:
	touch tmp/build.locked
	tar cf - -C src/static . | (cd build; tar xvf -)

build_front:
	touch tmp/build.locked
	rm -fr build/var/www/html
	cd src/front; npx vite build --outDir ../../build/var/www/html

build_done:
	rm -f tmp/build.locked

build_mounted: build_static build_front build_done

build: build_clean build_static build_front
	bin/makeDockerImage.sh

stop_container:
	-docker compose kill 2>/dev/null || echo "Pass: demo not runing"

local: build stop_container
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml local
	bin/docker-compose.env.sh .env
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"
	@echo "or Run: docker exec -it demo bash"

# Local run with mounted volume:
localMounted: build stop_container
	bin/preprocessDockerCompose.py src/docker-compose.yaml docker-compose.yaml mounted
	bin/docker-compose.env.sh .env
	docker compose up --remove-orphans --detach
	rm -f tmp/build.locked
	@echo "Open: http://localhost:8080/"
	@echo "or Run: docker exec -it demo bash"



demo_prod: build
	bin/preprocessDockerCompose.py src/docker-compose.yaml tmp/docker-compose.yaml production
	scp tmp/docker-compose.yaml demo_prod:dev/demo
	scp src/docker-compose.env demo_prod:dev/demo/.env
	docker tag demo:latest localhost:5000/demo:latest
	docker push localhost:5000/demo:latest
	ssh demo_prod "docker pull localhost:5000/demo"
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

clean:
	rm -fr bin/venv tmp/*