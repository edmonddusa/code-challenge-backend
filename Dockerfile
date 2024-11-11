FROM node:18.20.4
WORKDIR /usr/app
COPY package.json .
RUN npm install && npm install typescript -g && npm install -g tsx
COPY src/ ./src/
RUN ls -la
COPY .env .
COPY tsconfig.json .
EXPOSE 3000
CMD ["tsx", "./src/index.ts"]
