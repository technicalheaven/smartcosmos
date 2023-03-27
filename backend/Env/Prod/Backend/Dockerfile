FROM node:16.17.0
WoRKDIR /sc-backend
COPY ./backend/ ./
RUN pwd
RUN ls -la
RUN npm cache clean --force
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN rm -rf dist
RUN npm install -g pm2
RUN npm install nodemon -g
RUN npm install 
ENV DB_NAME = smartcosmos
ENV DB_HOST = sc-prod-database.mysql.database.azure.com
ENV DB_PORT = 3306
ENV DB_USER = bksfipnb
ENV DB_PASS = 0_AH96D6oduzmFcU
ENV IS_COSMOSDB=true
ENV COSMOSDB_USER='sc-prod-solution-mongo'
ENV COSMOSDB_PASSWORD='nYjrrse41tiuZKX7b1VJFXj7nfU4MshzwdSLJNHPfmHmzZXXCptl7qXHH8CPwxGEX3gZGKRI6k4kACDbGdiVaA=='
ENV COSMOSDB_DBNAME=smartcosmos
ENV COSMOSDB_TEST_DBNAME=smartcosmos_test
ENV COSMOSDB_HOST=sc-prod-solution-mongo.mongo.cosmos.azure.com
ENV COSMOSDB_PORT=10255
ENV RABBITMQ_URL=amqp://ProdSolutionRabbitmq:smartcosmos@172.10.40.12:5672
ENV RABBITMQ_CACHING=amqp://ProdSolutionRabbitmq:smartcosmos@172.10.40.12:5672
CMD npm run dev
