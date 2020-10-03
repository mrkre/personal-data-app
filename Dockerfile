FROM mhart/alpine-node:14

ENV NODE_ENV=development
WORKDIR /personal-data-app

COPY yarn.lock package.json ./
RUN yarn install

ENV NODE_ENV=production
COPY . .
RUN rm -rf ./dist && mkdir ./dist
RUN yarn run build

EXPOSE 8000
CMD ["yarn", "serve"]
