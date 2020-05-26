start: stop
	docker-compose up --build blog

stop:
	docker-compose down -v