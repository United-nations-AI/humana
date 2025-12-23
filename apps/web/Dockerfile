FROM node:20-alpine AS base
WORKDIR /app

# Build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Copy root package files for workspace support
COPY package.json package-lock.json* ./

# Copy web app files
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web ./apps/web

# Install dependencies
RUN npm install --workspace apps/web --ignore-scripts

# Build the app
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=production

RUN adduser -D -u 1001 appuser

# Copy built files
COPY --from=base --chown=appuser:appuser /app/apps/web/.next ./.next
COPY --from=base --chown=appuser:appuser /app/apps/web/public ./public
COPY --from=base --chown=appuser:appuser /app/apps/web/package.json ./package.json
COPY --from=base --chown=appuser:appuser /app/apps/web/next.config.js ./next.config.js
COPY --from=base --chown=appuser:appuser /app/apps/web/next-i18next.config.js ./next-i18next.config.js
COPY --from=base --chown=appuser:appuser /app/apps/web/i18n.ts ./i18n.ts
COPY --from=base --chown=appuser:appuser /app/apps/web/tsconfig.json ./tsconfig.json
COPY --from=base --chown=appuser:appuser /app/node_modules ./node_modules

USER appuser
EXPOSE 5000
CMD ["npx", "next", "start", "-p", "5000"]
