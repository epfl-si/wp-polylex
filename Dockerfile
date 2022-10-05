FROM ubuntu:focal

RUN set -e -x; export DEBIAN_FRONTEND=noninteractive; \
    apt -qy update; \
    apt -qy install curl gnupg

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && apt-get -qy install nodejs

# not recommended by the Meteor guide, but still works:
RUN curl https://install.meteor.com/ | sh

RUN mkdir -p /usr/src/app/
COPY ./app /usr/src/app
WORKDIR /usr/src/app/
RUN meteor npm i
RUN meteor build --allow-superuser /usr --directory
RUN cd /usr/bundle/programs/server && npm install

FROM node:14.19.3-alpine

COPY --from=0 /usr/bundle /usr/bundle/
WORKDIR /usr/bundle

CMD node main.js
