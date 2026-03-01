# Use official Bun image
FROM oven/bun:1.3.8 AS base

# Build frontend
FROM base AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install --frozen-lockfile

COPY frontend/ ./

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

# Backend stage
FROM base AS backend
WORKDIR /app/backend

# Install dependencies
COPY backend/package.json backend/bun.lockb* ./
RUN bun install --frozen-lockfile --production

# Copy backend source
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

# Expose port
EXPOSE 5000

# Environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start application
CMD ["bun", "index.ts"]