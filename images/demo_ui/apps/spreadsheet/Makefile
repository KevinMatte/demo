-include .env

.PHONY: build_clean build build_static build_src spreadsheet_js_dev

build_clean:
	rm -fr build
	mkdir build

build_static:
	rm -fr build
	cp -pr static build

build: build_static

spreadsheet_dev:
	pnpm run dev --port 5173
