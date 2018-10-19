FROM node:8-alpine

RUN apk update && apk upgrade \
	&& apk add --no-cache git \
	&& apk --no-cache add --virtual builds-deps build-base python

RUN npm install -g yarn nodemon babel-cli cross-env eslint npm-run-all node-gyp node-pre-gyp \
	&& npm rebuild bcrypt --build-from-source

WORKDIR /usr/src/app

COPY ./package*.json .

RUN yarn install

COPY . .

EXPOSE 3000
