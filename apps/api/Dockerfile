FROM node:20-alpine AS base
WORKDIR /app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

RUN npm i --production=false && npm run build && adduser -D -u 1001 appuser && chown -R appuser /app

USER appuser
EXPOSE 4000
CMD ["npm", "run", "dev"]

