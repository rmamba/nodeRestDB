FROM node:10-alpine as build

WORKDIR /usr/src/app

COPY . $WORKDIR

RUN npm install
RUN npm run build

# COPY ./dist .
FROM node:10-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json $WORKDIR

RUN npm install
RUN npm install pm2 -g

COPY --from=build /usr/src/app/dist $WORKDIR

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]
