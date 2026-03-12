FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npm run migrate && npm run generate && node dist/index.js"]