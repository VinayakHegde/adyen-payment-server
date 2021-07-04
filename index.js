const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

const Store = require('./store');
const store = new Store();

const configuration = require('./handler/configuration');
const paymentMethods = require('./handler/payment-methods');
const payments = require('./handler/payments');
const paymentsDetails = require('./handler/payments-details');
const redirect = require('./handler/redirect');

app.get(configuration.url, configuration.handler(store));
app.post(paymentMethods.url, paymentMethods.handler(store));
app.post(payments.url, payments.handler(store));
app.post(paymentsDetails.url, paymentsDetails.handler(store));
app.all(redirect.url, redirect.handler(store));

const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/", "index.html"));
});

const PORT = store.appConfig.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
