FROM node:alpine

WORKDIR /carlos/src/app

COPY package*.json ./

RUN npm install npm
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "npm", "start" ]