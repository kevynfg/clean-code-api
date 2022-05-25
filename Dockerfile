FROM node
WORKDIR /usr/src/clean-node-api-study
COPY ./package.json .
RUN npm install --omit=dev
CMD npm start