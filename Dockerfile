# --- Stage 1: front-end build -----------------------
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# --- Stage 2: back-end build ------------------------
FROM gradle:8.13-jdk21 AS backend-builder

# 1) 作業ディレクトリを作って移動
WORKDIR /home/gradle/project

# 2) host の backend フォルダを、そのまま project 配下にコピー
#    → /home/gradle/project/backend 以下に gradlew, build.gradle, src/… が入る
COPY --chown=gradle:gradle backend/ ./backend

# 3) フロント成果物を静的資産に配置
COPY --from=frontend-builder /app/dist ./backend/src/main/resources/static

# 4) gradle ユーザーに切り替え＆ビルド
USER gradle
WORKDIR /home/gradle/project/backend
RUN ./gradlew clean bootJar --no-daemon

# --- Stage 3: runtime image --------------------------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-builder \
     /home/gradle/project/backend/build/libs/*.jar \
     ./app.jar

EXPOSE ${PORT:-8080}
ENTRYPOINT ["java","-jar","app.jar"]