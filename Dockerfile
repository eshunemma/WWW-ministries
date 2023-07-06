FROM node:alpine

WORKDIR /app/www_project

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "run", "prod" ]