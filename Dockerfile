# base deps
FROM node:20-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./

# install deps
FROM base AS deps
RUN npm install

# untuk prod
FROM deps AS builder
COPY . .
RUN npm run build

# prod image
FROM node:20-alpine AS production
WORKDIR /app

# Salin package.json untuk npm install --omit=dev
COPY package*.json ./
RUN npm install --omit=dev

# Salin hasil build
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env .env

EXPOSE 4000
ENV NODE_ENV production
CMD ["npm", "run", "start"]

# dev image
FROM deps AS development
WORKDIR /app
COPY . .

# Gunakan node_modules dari deps stage
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 4000
ENV NODE_ENV development
CMD ["npm", "run", "dev"]
