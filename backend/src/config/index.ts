import dotenv from 'dotenv';
dotenv.config();

const baseUrls:any = {
    local: "http://localhost:8080",
    test: "http://localhost:8080",
    development: "https://dev.lifecycles.io",
    qa: "https://qa.lifecycles.io",
    production :'https://solution.lifecycles.io',
}

const emailUrls:any = {
    local: "http://localhost:3000",
    test: "http://localhost:3000",
    development: "https://dev.lifecycles.io",
    qa: "https://qa.lifecycles.io",
    production :'https://solution.lifecycles.io',
}

const tenantID:any = {
    local: "efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    test: "efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    development: "efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    qa:"40841e17-bf92-44f6-ace5-ce917cf08742",
    demo:"a5d53ab3-f9fe-4b21-983b-3aaeb2b48c6d",
    production:"1b49b69d-4d78-49a5-873c-9b300a4d2c68"
}

const clientID:any = {
    local: "f2354310-275e-4e7d-a551-c71e1bcc53d5",
    test: "f2354310-275e-4e7d-a551-c71e1bcc53d5",
    development: "f2354310-275e-4e7d-a551-c71e1bcc53d5",
    qa:"d2da4ec7-c1b5-4206-8709-d9187c8700d8",
    demo:"c0c68319-cb80-4d93-9f81-674bc227c0d9",
    production:"6d8007ab-c1fa-40ef-a0fa-4d9b6061546a"
}

const clientSecret:any = {
    local: "ZEg8Q~EuHWJm5p-cou_C5I8eMS-o4w8iA3Fd1aW7",
    test: "ZEg8Q~EuHWJm5p-cou_C5I8eMS-o4w8iA3Fd1aW7",
    development: "ZEg8Q~EuHWJm5p-cou_C5I8eMS-o4w8iA3Fd1aW7",
    qa:"Me28Q~g4aXiGtZCwtHWuWN2vO0Xoy1vUsbi0naeC",
    demo:"I2E8Q~iIJTDs8R3VQgObTgZT31KZ2UyqAAYqvcn4",
    production:"u1T8Q~ULXglfRMvNmlmDW-l8xVEt6NF64KaYocgP"
}

const authority:any = {
    local: "https://login.microsoftonline.com/efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    test: "https://login.microsoftonline.com/efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    development: "https://login.microsoftonline.com/efe3fb99-66dd-48b8-8a04-16fa8e998c5a",
    qa:"https://login.microsoftonline.com/40841e17-bf92-44f6-ace5-ce917cf08742",
    demo:"https://login.microsoftonline.com/a5d53ab3-f9fe-4b21-983b-3aaeb2b48c6d",
    production:"https://login.microsoftonline.com/1b49b69d-4d78-49a5-873c-9b300a4d2c68"
}

const domain:any = {
    local: "smartcosmosauth1.onmicrosoft.com",
    test: "smartcosmosauth1.onmicrosoft.com",
    development: "smartcosmosauth1.onmicrosoft.com",
    qa:"smartcosmosauth3.onmicrosoft.com",
    demo:"smartcosmosauth4.onmicrosoft.com",
    production:"smartcosmosauth5.onmicrosoft.com"
}

const extension_tenantId:any = {
    local: "extension_f2354310275e4e7da551c71e1bcc53d5_tenantId",
    test: "extension_f2354310275e4e7da551c71e1bcc53d5_tenantId",
    development: "extension_f2354310275e4e7da551c71e1bcc53d5_tenantId",
    qa:"extension_d2da4ec7c1b542068709d9187c8700d8_tenantId",
    demo:"extension_c0c68319cb804d939f81674bc227c0d9_tenantId",
    production:"extension_6d8007abc1fa40efa0fa4d9b6061546a_tenantId"
}

const extension_userId:any = {
    local: "extension_f2354310275e4e7da551c71e1bcc53d5_userId",
    test: "extension_f2354310275e4e7da551c71e1bcc53d5_userId",
    development: "extension_f2354310275e4e7da551c71e1bcc53d5_userId",
    qa:"extension_d2da4ec7c1b542068709d9187c8700d8_userId",
    demo:"extension_c0c68319cb804d939f81674bc227c0d9_userId",
    production:"extension_6d8007abc1fa40efa0fa4d9b6061546a_userId"
}

const env:any = process.env.NODE_ENV || 'development';

export const config = {
    BASE_URL: baseUrls[env],
    EMAIL_URL: emailUrls[env],
    TENANT_ID:tenantID[env],
    CLIENT_ID:clientID[env],
    CLIENT_SECRET:clientSecret[env],
    authority:authority[env],
    DOMAIN:domain[env],
    extension_tenantId:extension_tenantId[env],
    extension_userId:extension_userId[env],
    API_PREFIX: '/api/v1',
    UPLOAD_FILE_PATH:'./src/libs/fileUploader/uploads/',
    UPLOAD_FILE_SIZE: 10485760,  // in bytes
    SERVER_HTTPS: false,
}

 
