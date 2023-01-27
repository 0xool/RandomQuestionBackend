FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /the/workdir/path

COPY package.json /usr/src/app/

RUN yarn start

COPY . /usr/src/app

EXPOSE 3000