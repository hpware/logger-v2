FROM oven/bun:latest as builder
WORKDIR /app
COPY package.json ./
COPY bun.lock* package-lock.json* yarn.lock* ./
RUN bun pm untrusted
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.output /app/.output
RUN bun install --production
EXPOSE 3000
CMD ["bun", "run", "preview"]
