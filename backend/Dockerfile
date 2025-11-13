# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /lebobeautyco/backend
COPY ./backend ./
COPY ./backend/.env.docker .env
COPY ./packages /lebobeautyco/packages
RUN npm install

CMD [ "npm", "run", "start:setup"]
EXPOSE 4005
