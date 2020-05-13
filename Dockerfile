FROM node:10-alpine as build

WORKDIR /usr/src/app

COPY . ./

RUN npm install
RUN npm run build

# COPY ./dist .
FROM node:10-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# RUN npm install
# RUN npm install pm2 -g

COPY --from=build /usr/src/app/dist ./

EXPOSE 3000

CMD ["node", "index.js"]
