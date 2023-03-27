FROM node:16.17.0-alpine
WoRKDIR /sc-backend
COPY ./backend/ ./
RUN pwd
RUN ls -la
RUN npm cache clean --force
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN rm -rf dist
RUN npm install 
RUN pwd
RUN mkdir -p /sc-backend/tagUploads/{InventoryFiles,InventoryFileSite,DiscrepancyFiles,tagInvalidData}
ENV DB_NAME = smartcosmos
ENV DB_HOST = sc-database.mysql.database.azure.com
ENV DB_PORT = 3306
ENV DB_USER = scdatabase
ENV DB_PASS = rgbXYZ@9182
ENV IS_COSMOSDB=true
ENV COSMOSDB_USER='solution-dev-qamongo'
ENV COSMOSDB_PASSWORD='HbylJkfMu8lwRwlAHOWqID9SY256BEnBO9Ulj0awumaJ6VETOOr6cAXu2Od6WQjg5QwOQEzI7ZerACDbyvkF0w=='
ENV COSMOSDB_DBNAME=smartcosmos
ENV COSMOSDB_TEST_DBNAME=smartcosmos_test
ENV COSMOSDB_HOST=solution-dev-qamongo.mongo.cosmos.azure.com
ENV COSMOSDB_PORT=10255
ENV RABBITMQ_URL=amqp://scrabbitmq:rgbXYZ9182@10.0.2.10:5672
ENV RABBITMQ_CACHING=amqp://scrabbitmq:rgbXYZ9182@10.0.2.10:5672
CMD npm run dev 
