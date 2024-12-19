FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV GRAPHQL_URL=http://server:4000/graphql
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]