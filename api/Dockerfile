FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client, build application, and prune devDependencies while keeping Prisma CLI
RUN npx prisma generate && npm run build \
 && cp -a node_modules/prisma /tmp/prisma-pkg \
 && cp -a node_modules/@prisma /tmp/at-prisma-pkg \
 && npm prune --omit=dev \
 && mkdir -p node_modules/@prisma \
 && mv /tmp/prisma-pkg node_modules/prisma \
 && cp -a /tmp/at-prisma-pkg/. node_modules/@prisma/ \
 && rm -rf /tmp/at-prisma-pkg

# Production runner stage
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_URL="file:/app/data/tasks.db"

# Copy package files, prisma schema, pruned production dependencies, and compiled code
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Directory for SQLite database persistence
RUN mkdir -p /app/data

EXPOSE 4000

CMD ["sh", "-c", "node ./node_modules/prisma/build/index.js db push --skip-generate && node dist/main"]
