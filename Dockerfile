# not using node:lts-alpine due to https://github.com/npm/cli/issues/1151
FROM node:14.3.0-alpine3.11 AS builder

COPY . /app/

WORKDIR /app


RUN npm ci
RUN npm run build

RUN rm -rf node_modules && \
    npm install --only=prod

FROM gcr.io/distroless/nodejs

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/healthcheck.js /app/healthcheck.js

HEALTHCHECK --interval=12s --timeout=12s --start-period=10s \  
    CMD [ "/nodejs/bin/node", "/app/healthcheck.js" ]

CMD [ "/app/dist/main" ]
