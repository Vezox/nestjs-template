FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run migration:run

RUN npm install -g pm2

CMD ["pm2-runtime", "ecosystem.config.js"]