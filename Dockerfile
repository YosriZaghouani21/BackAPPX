FROM node:16


LABEL maintainer="COTE SERVEUR <cote.serveur@esprit.tn>"



WORKDIR /home/node/app
COPY package*.json ./
RUN npm install --production

COPY . .

USER node

EXPOSE 9092

CMD ["node","server.js"]