FROM node:16.19.0

COPY ./package*.json /home/node/back/
WORKDIR /home/node/back/
RUN npm install
COPY . .
COPY .env .
CMD ["npm", "run", "startOnServer"]
