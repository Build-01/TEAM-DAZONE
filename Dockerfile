FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "src/index.js"]
