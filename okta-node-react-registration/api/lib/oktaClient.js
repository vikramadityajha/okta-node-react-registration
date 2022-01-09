const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-31166667.okta.com',
  token: '00RRi1xq3rTdO_cE6pBX2_5zlWPmpedOlsAXKRvLSk'
});

module.exports = client;