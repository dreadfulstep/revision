FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npm run migrate && npm run generate && npm start"]