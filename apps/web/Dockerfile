# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY ../../package.json ./
COPY ./package.json ./apps/web/package.json
RUN npm i --workspace apps/web --ignore-scripts

# Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package.json ./
COPY ./package.json ./apps/web/package.json
COPY ./ .
RUN npm run build -w apps/web

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

RUN adduser -D -u 1001 appuser && chown -R appuser /app
USER appuser
EXPOSE 5000
CMD ["npx", "next", "start", "-p", "5000", "-w", "apps/web"]

