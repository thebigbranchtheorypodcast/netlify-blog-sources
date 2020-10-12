.PHONY: build

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
	docker-compose run --entrypoint hugo blog
	cd public
	git checkout master
	git add .
	git commit -m "update"
	git push