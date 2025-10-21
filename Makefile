
.PHONY: all www venv build_front stop_container build build_static build_front

build_clean:
	rm -fr build
	mkdir -p build/var/www


build_static:
	tar cf - -C src/static . | (cd build; tar xvf -)

build_front:
	rm -fr build/var/www/html
	cd src/front; npx vite build --outDir ../../build/var/www/html

build_mounted: build_static build_front

build: build_clean build_static build_front

	# docker container rm demo
	bin/makeDockerImage.sh

stop_container:
	-docker kill demo 2>/dev/null || echo "Pass: demo not runing"
	-docker rm demo 2>/dev/null || echo "Pass: demo image missing"

local: build stop_container
	docker run --rm -dit --name demo -p 8080:80 "demo:$$(cat src/version.txt)"
	echo "Open: http://localhost:8080/"
	echo "or Run: docker exec -it demo bash"

# Local run with mounted volume:
localMounted: build stop_container
	docker run -d --rm --name demo -p 8080:80 \
	    -v $(CURDIR)/build/var/www:/var/www \
	    "demo:$$(cat src/version.txt)"
	@echo "Open: http://localhost:8080/"
	@echo "or Run: docker exec -it demo bash"



portable: build
	-ssh portable docker stop demo
	# docker container rm demo
	docker tag demo:latest localhost:5000/demo:latest
	docker push localhost:5000/demo:latest
	ssh portable docker pull localhost:5000/demo
	ssh portable docker run --rm -dit --name demo -p 8080:80 localhost:5000/demo
	echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"

build2:
	spd-say -i "-50" "Built"

venv: bin/venv.timestamp

bin/venv.timestamp: bin/requirements.txt
	if [ \! -d bin/venv ]; then \
	   python3 -m venv bin/venv; \
	fi
	. bin/venv/bin/activate && \
	   pip install -r bin/requirements.txt;
	touch bin/venv.timestamp;

clean:
	rm -fr bin/venv bin/*.timestamp