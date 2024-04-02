FROM node:21-alpine AS base
RUN npm install -g pnpm
ENV PNPM_HOME /usr/local/bin

# PRUNING STAGE
FROM base AS pruner

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN pnpm add -g turbo@1.12.4
COPY . .
RUN turbo prune @fyp/server --docker

# BULDING STAGE
FROM base AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install

COPY --from=pruner /app/out/full/ .

RUN pnpm turbo run build --filter=server


# RUNNING IN PRODUCTION
FROM base AS producttion

WORKDIR /app
COPY --from=builder /app .
EXPOSE $PORT

CMD ["node", "./apps/server/dist/index.js"]