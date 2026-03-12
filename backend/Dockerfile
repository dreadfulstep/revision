FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json tsconfig.paths.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["sh", "-c", "npx drizzle-kit migrate:dev && node dist/index.js"]