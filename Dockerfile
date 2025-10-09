FROM node:latest as builder
WORKDIR /app
COPY package.json ./
COPY bun.lock ./bun.lock
COPY drizzle ./drizzle
RUN npm install -g bun
RUN bun pm untrusted
RUN bun install
COPY . .
RUN bun run build

FROM node:latest
WORKDIR /app
COPY package.json ./
COPY bpm.lock ./bun.lock
COPY drizzle ./drizzle
RUN npm install -g bun
COPY --from=builder /app/.output /app/.output
RUN bun install --production

# Run migrations before starting the app
RUN bun run db:migrate || echo "Migration might fail if DB is not ready, will be handled by app"

EXPOSE 3000
CMD ["bun", "run", "preview"]
