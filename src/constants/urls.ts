const isProd = process.env.NODE_ENV === 'production';

export const CLIENT_ID = isProd
  ? '6fe549ee7be5faa1cf4c'
  : 'dbf6e8904fe785430a96';
export const PROXY_URL = isProd
  ? 'https://x-check-gate.herokuapp.com/authenticate/'
  : 'https://x-check-app.herokuapp.com/authenticate/';

export const JSON_API_URL = isProd
  ? 'https://xcheck-server.herokuapp.com'
  : 'http://localhost:3001';
