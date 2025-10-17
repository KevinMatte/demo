
.PHONY: all www venv

build: venv
	# docker container rm demo
	bin/makeDockerImage.sh

local: build
	-docker stop demo
	-docker rm demo
	docker run --rm -dit --name demo -p 8080:80 "demo:$$(cat src/www/html/version.txt)"
	echo "Open: http://localhost:8080/"

localMounted:
	docker run --rm -dit --name demo -p 8080:80 -v /home/kevin/dev/demo/www:/usr/local/apache2/htdocs "demo:$$(cat src/www/html/version.txt)"

portable:
	-ssh portable docker stop demo
	# docker container rm demo
	docker tag demo:latest localhost:5000/demo:latest
	docker push localhost:5000/demo:latest
	ssh portable docker pull localhost:5000/demo
	ssh portable docker run --rm -dit --name demo -p 8080:80 localhost:5000/demo
	echo "Open: http://184.64.118.116/ or http://192.168.1.4:8080/"

# Local run with mounted volume:
dockerLocal:
	-docker stop demo
	-docker rm demo
	docker run -d -p 8080:80 --restart=always --name demo \
	-v /home/kevin/dev/demo/src/www/html:/var/www/html \
	demo
	echo "Open: http://localhost:8080/"


build2: www
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