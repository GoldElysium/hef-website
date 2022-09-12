# Install dependencies only when needed
FROM node:16-buster-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Rebuild the source code only when needed
FROM node:16-buster-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG ENV_FILE
ENV NEXT_TELEMETRY_DISABLED 1

RUN echo $ENV_FILE | base64 -d > .env.production \
    && npm run build

# Production image, copy all the files and run next
FROM node:16-buster-slim AS runner
WORKDIR /app

ARG ENV_FILE
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs \
    && echo $ENV_FILE | base64 -d > .env.production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
