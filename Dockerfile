# --------------------
# Base dependencies
# --------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./

# --------------------
# Install deps
# --------------------
FROM base AS deps
RUN npm install

# --------------------
# Build untuk production
# --------------------
FROM deps AS builder
WORKDIR /app
COPY . .
COPY .env .env # ✅ fix penting di sini
RUN npm run build

# --------------------
# Production Image
# --------------------
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env .env

EXPOSE 4000
ENV NODE_ENV production
CMD ["npm", "run", "start"]

# --------------------
# Development Image
# --------------------
FROM deps AS development
WORKDIR /app
COPY . .

COPY --from=deps /app/node_modules ./node_modules

EXPOSE 4000
ENV NODE_ENV development
CMD ["npm", "run", "dev"]
