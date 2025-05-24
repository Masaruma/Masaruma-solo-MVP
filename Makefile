test:
	cd backend && ./gradlew test
	cd frontend && npm run test


docker-build:
	docker build -t my-solo-app:latest .

docker-local-run:
	docker run --rm -p 8080:8080 \
 		   --env-file backend/.envDockerlocal \
 		   my-solo-app:latest

lint:
	cd backend && ./gradlew ./gradlew ktlintFormat