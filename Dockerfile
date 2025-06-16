# syntax=docker/dockerfile:1
FROM node:22 AS builder
WORKDIR /src
COPY . /src
RUN npm install
RUN npm run build

FROM node:22
LABEL authors="lenis0012"

COPY --from=builder /src/dist /app/dist
COPY --parents ./migrations /app/

WORKDIR /app
ENTRYPOINT ["node", "--enable-source-maps", "dist/server.cjs"]
EXPOSE 3000
