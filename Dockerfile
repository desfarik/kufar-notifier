FROM node:18-alpine

LABEL authors="dastreyko"

RUN npm install -g npm@latest

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci --no-audit

COPY . .

RUN npm run build

CMD [ "node", "dist/src/main" ]
