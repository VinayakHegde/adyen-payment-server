const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const app_config = require('./app.json');

class Store {
  config;
  client;
  checkout;
  appConfig;
  paymentDataStore;
  originStore;
  constructor() {
    this.config = new Config();
    this.config.apiKey = app_config.API_KEY;
    this.client = new Client({ config: this.config });
    this.client.setEnvironment("TEST");
    this.checkout = new CheckoutAPI(this.client);
    this.appConfig = app_config;
    this.paymentDataStore = {};
    this.originStore = {};
  }
}

module.exports = Store;
