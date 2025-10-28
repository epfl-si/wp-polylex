## Setup a meteor image in production mode
#
ARG BASE_IMAGE=node:22-trixie

FROM $BASE_IMAGE AS build

# Install meteor
RUN npx meteor

ENV NODE_ENV=production
# to ignore caniuse-lite outdated warning
ENV BROWSERSLIST_IGNORE_OLD_DATA=1

ENV PATH=$PATH:/root/.meteor
ENV METEOR_ALLOW_SUPERUSER=1

WORKDIR /app

COPY ./app/package.json ./app/package-lock ./

RUN meteor npm install --production

COPY ./app .

RUN meteor build --directory /built-app
RUN cd /built-app/bundle/programs/server && meteor npm install --production

FROM $BASE_IMAGE

ENV NODE_ENV=production
COPY --from=build /built-app/bundle /app
WORKDIR /app

CMD ["node", "main.js"]
