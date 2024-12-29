build-and-deploy:
	docker compose -f docker-compose.amd64.yml build --push
	docker compose -f docker-compose.arm64.yml build --push