FROM node:20-alpine

ARG GRAPHQL_URL=http://server:4000/graphql

ENV GRAPHQL_URL=$GRAPHQL_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]