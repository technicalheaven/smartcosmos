
// export const S3Config = {
//   bucketName: 'bluebitetest',
//   bucketFolder:'devdata',
//   region: 'us-east-1',
//   accessKeyId: 'AKIA3BIIOTKMDWCF6Y4M',
//   secretAccessKey: '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'
// };

export const enablementStatus = {
  PENDING: 'PENDING',
  ENABLED: 'ENABLED',
  DE_ENABLED: 'DE-ENABLED',
  DUPLICATE: 'DUPLICATE',
  PARTIAL_DUPLICATE: 'PARTIAL-DUPLICATE'
};

 const S3Configs:any = {
  local:{
    bucketName: 'bluebite-enablement',
    bucketFolder: 'enablements/fcd2e801-ea17-416c-86e5-05ed7043acd6',
    region: 'us-east-1',
    accessKeyId: 'AKIAJU42OOGK66YKFBPQ',
    secretAccessKey: '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'
  },
  development:{
    bucketName: 'bluebite-enablement',
    bucketFolder: 'enablements/fcd2e801-ea17-416c-86e5-05ed7043acd6',
    region: 'us-east-1',
    accessKeyId: 'AKIAJU42OOGK66YKFBPQ',
    secretAccessKey: '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'
  },
  test:{
    bucketName: 'bluebite-enablement',
    bucketFolder: 'enablements/fcd2e801-ea17-416c-86e5-05ed7043acd6',
    region: 'us-east-1',
    accessKeyId: 'AKIAJU42OOGK66YKFBPQ',
    secretAccessKey: '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'
  },
  qa:{
    bucketName: 'bluebite-enablement',
    bucketFolder: 'enablements/fcd2e801-ea17-416c-86e5-05ed7043acd6',
    region: 'us-east-1',
    accessKeyId: 'AKIAJU42OOGK66YKFBPQ',
    secretAccessKey: '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'
  },
  production:{
    bucketName: 'bluebite-enablement',
    bucketFolder: 'enablements/2034f899-5120-4265-ab61-949699020a5f',
    region: 'us-east-1',
    accessKeyId: 'AKIAJU42OOGK66YKFBPQ',
    secretAccessKey: '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'
  },
}

const env = process.env.NODE_ENV ?? 'development';

export const S3Config = S3Configs[env];







