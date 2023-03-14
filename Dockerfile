FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Install MySQL
RUN apt-get update && apt-get install -y mysql-server

# Create a database
RUN service mysql start && \
    mysql -u root -e "CREATE DATABASE mydatabase;"

# Expose MySQL port
EXPOSE 3000 3306 3307

# Start MySQL service
CMD service mysql start && node server.js
