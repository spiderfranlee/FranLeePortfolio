# ==========================================
# Phase 1: Builder
# ==========================================
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy dependency structures
COPY package*.json ./

# Install all dependencies required for the compilation
RUN npm ci

# Copy code contents
COPY . .

# Run production compilation (creates /dist directory containing React asset files and bundled server.cjs)
RUN npm run build

# ==========================================
# Phase 2: Production runner
# ==========================================
FROM node:20-slim

WORKDIR /usr/src/app

# Copy package structures to install production dependencies only
COPY package*.json ./

# Install strict production-only dependency tree
RUN npm ci --only=production

# Copy building artifacts from previous stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose standard production port
EXPOSE 3000

# Secure default parameters
ENV NODE_ENV=production
ENV PORT=3000

# Set startup runner
CMD ["npm", "run", "start"]
