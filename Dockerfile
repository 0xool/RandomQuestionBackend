FROM node:latest

#RUN mkdir -p /therapist-app

WORKDIR /therapist-app

COPY package*.json ./

RUN npm install

COPY . /therapist-app

# Expose MySQL port
EXPOSE 3000 3306 3307 8000

# Start MySQL service
CMD node src/server.js
