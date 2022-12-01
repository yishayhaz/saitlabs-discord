const axios = require("axios");

const workspace = process.env.CLOCKIFY_WORKSPACE;

const base_url = `https://api.clockify.me/api/v1`;

const clockify_api = axios.create({
  baseURL: base_url,
});

module.exports = {
  clockify_api,
  base_url,
  workspace,
};
