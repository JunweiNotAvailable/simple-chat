export const config = {
  api: {
    data: {
      single: "https://lkwpju0wtl.execute-api.ap-northeast-1.amazonaws.com/prod",
      custom: "https://lkwpju0wtl.execute-api.ap-northeast-1.amazonaws.com/prod",
    },
    s3: "https://3tdbs9e5ye.execute-api.ap-northeast-1.amazonaws.com/production",
    webSocket: {
      wss: "wss://xknkn2l47e.execute-api.ap-northeast-1.amazonaws.com/production/",
      https: "https://xknkn2l47e.execute-api.ap-northeast-1.amazonaws.com/production/@connections",
    }
  },
  cognito: {
    REGION: "ap-northeast-1",
    USER_POOL_ID: "ap-northeast-1_8uCcPYrN1",
    APP_CLIENT_ID: "3v7p3qb30lg1drangooqsgluch"
  },
}