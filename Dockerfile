FROM node
WORKDIR /usr/src/clean-node-api-study
COPY ./package.json .
RUN npm install --omit=dev
COPY ./dist ./dist
EXPOSE 5000
CMD npm start