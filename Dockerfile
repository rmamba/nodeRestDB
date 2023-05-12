FROM node:14-alpine as build

WORKDIR /usr/src/app

COPY . .

RUN yarn install --production=false
RUN yarn build

FROM node:14-alpine
LABEL org.opencontainers.image.authors="rmamba@gmail.com"

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# RUN npm install
# RUN npm install pm2 -g

COPY --from=build /usr/src/app/dist ./

EXPOSE 3000

CMD ["node", "index.js"]
