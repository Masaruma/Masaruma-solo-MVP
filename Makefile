backend-test:
	cd backend && ./gradlew test
frontend-test:
	cd frontend && npm run test
all-test:backend-test frontend-test

backend-lint:
	cd backend && ./gradlew ktlintFormat
frontend-lint:
	cd frontend && npm run build
	cd frontend && npm run lint
all-lint: backend-lint frontend-lint

backendApplication:
	cd frontend && npm run build
	cd backend && ./gradlew bootrun
frontendApplication:
	cd frontend && npm run dev

docker-compose-up:
	cd backend && docker-compose up -d

docker-compose-down:
	cd backend && docker-compose down

docker-build:
	docker build -t my-solo-app:latest .
docker-local-run:
	docker run --rm -p 8080:8080 \
 		   --env-file backend/.envDockerlocal \
 		   my-solo-app:latest

