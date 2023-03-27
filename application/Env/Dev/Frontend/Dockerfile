From node:alpine
ENV NPM_CONFIG_LOGLEVEL warn
COPY ./application/ ./
RUN npm install 
RUN npm run build
RUN npm install -g serve
CMD serve -s build
EXPOSE 3000
