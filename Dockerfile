FROM oven/bun:1.3.8 AS base

FROM base AS frontend-builder
WORKDIR /app/web
COPY web/package.json web/bun.lockb* ./
RUN bun install --frozen-lockfile
COPY web/ ./
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

FROM base AS backend
WORKDIR /app/backend
COPY backend/package.json backend/bun.lockb* ./
RUN bun install --frozen-lockfile --production
COPY backend/ ./
COPY --from=frontend-builder /app/web/dist ../web/dist
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"
CMD ["bun", "index.ts"]