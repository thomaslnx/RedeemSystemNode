FROM node:20.11.1

WORKDIR /nodeapi

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev-docker"]
# CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "prod"]