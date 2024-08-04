FROM node:20.15.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /usr/src/app/uploads && chown -R node:node /usr/src/app/uploads
EXPOSE 3000

CMD ["npm", "run", "dev"]