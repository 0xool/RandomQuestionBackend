FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Install MySQL
RUN apt-get install -y mysql-server mysql-client

# Expose MySQL port
EXPOSE 3000 3306 3307

# Start MySQL service
CMD service mysql start && node server.js