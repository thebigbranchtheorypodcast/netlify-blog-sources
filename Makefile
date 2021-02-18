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

deploy:
	git submodule update --init
	cd public && git checkout master && git pull origin master
	docker-compose run --entrypoint hugo blog
	cd public && git add . && git commit -m "update to $(COMMIT)" && git push
	