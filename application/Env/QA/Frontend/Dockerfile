From node:alpine
WORKDIR /sc-frontend
COPY ./application/ ./
RUN ls -la
RUN rm -rf package-lock.json node-modules
RUN npm install 
CMD npm run start //Coomand to Start the NPM Server
