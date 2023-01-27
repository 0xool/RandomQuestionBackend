FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /the/workdir/path

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 3000