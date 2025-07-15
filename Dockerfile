# --------------------------
# 🧱 Base dependencies stage
# --------------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./

# --------------------------
# 📦 Install dependencies
# --------------------------
FROM base AS deps
RUN npm install

# --------------------------
# 🏗️  Build untuk production
# --------------------------
FROM deps AS builder
WORKDIR /app
COPY . .

# Inject build-time env
ARG API_BASE_URL
ARG CDN_WORKER_URL
ENV API_BASE_URL=$API_BASE_URL
ENV CDN_WORKER_URL=$CDN_WORKER_URL

RUN npm run build


# --------------------------
# 🚀 Production Image
# --------------------------
FROM node:20-alpine AS production
WORKDIR /app

# Install only prod deps
COPY package*.json ./
RUN npm install --omit=dev

# Salin hasil build
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./

EXPOSE 4000
ENV NODE_ENV production
CMD ["npm", "run", "start"]

# --------------------------
# 🔁 Development Image (optional)
# --------------------------
FROM deps AS development
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 4000
ENV NODE_ENV development
CMD ["npm", "run", "dev"]
