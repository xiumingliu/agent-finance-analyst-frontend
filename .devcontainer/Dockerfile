# Leverage devcontainers' Node base for speed; add tini for PID 1
ARG NODE_VERSION=20
FROM mcr.microsoft.com/devcontainers/javascript-node:${NODE_VERSION}

# Enable corepack (pnpm)
RUN corepack enable