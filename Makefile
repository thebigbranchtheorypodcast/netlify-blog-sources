.PHONY: build

COMMIT = $(shell git rev-parse --short=7 HEAD)

build:
	docker-compose build blog

start: stop build
	docker-compose up blog

stop:
	docker-compose down -v

shell: stop build
	docker-compose run --service-ports --entrypoint sh blog
	