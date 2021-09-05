FROM node:12

COPY build/ /app/build/

RUN npm i -g serve --silent

EXPOSE 5000

CMD [ "serve","-s","/app/build" ]



