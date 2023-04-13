FROM node:18.15.0-bullseye-slim

WORKDIR /app
VOLUME [ "/app/db" ]
VOLUME [ "/app/assets" ]
VOLUME [ "/app/dist/assets" ]

RUN npm install pnpm@6 -g

ARG SHA=unknown

ADD package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile 

ADD public.ts requirements.txt tailwind.config.js tsconfig.json .babelrc .postcssrc .prettierrc srv.tsconfig.json ./
ADD common/ ./common/
ADD srv/ ./srv/
ADD web/ ./web

RUN pnpm run build:server && pnpm run build && mkdir -p /app/assets && echo "${SHA}" > /app/version.txt

ENV ADAPTERS=horde,novel,kobold,luminai,openai,chai,scale,claude \
  LOG_LEVEL=info \
  INITIAL_USER=administrator \
  DB_NAME=aivo \
  ASSET_FOLDER=/app/dist/assets

EXPOSE 3001
EXPOSE 5001

ENTRYPOINT [ "pnpm" ]
CMD ["run", "server"]