FROM node:14 as dev

WORKDIR /carlos/src/app

COPY package*.json ./

RUN npm install npm
RUN npm install

COPY . .

RUN npm run build

####################
###  Production  ###
####################

FROM node:14 as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /carlos/src/app

COPY --from=dev /carlos/src/app/ .

EXPOSE 4000

CMD [ "node", "dist/main" ]
# docker build -t blog-docker
# docker run blog-docker