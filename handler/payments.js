const { uuid } = require("uuidv4");
const currencyOf = require("../utils/currency-of");

const handler = store => async (req, res) => {
  const currency = currencyOf(req.body.paymentMethod.type);
  // find shopper IP from request
  const shopperIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log('/api/payments', req.body)

  try {
    // unique ref for the transaction
    const orderRef = uuid();
    // Ideally the data passed here should be computed based on business logic
    const response = await store.checkout.payments({
      amount: { currency, value: 1000 }, // value is 10€ in minor units
      reference: orderRef, // required
      merchantAccount: store.appConfig.MERCHANT_ACCOUNT, // required
      channel: "Web", // required
      additionalData: {
        // required for 3ds2 native flow
        allow3DS2: true,
      },
      origin: "http://localhost:8080", // required for 3ds2 native flow
      browserInfo: req.body.browserInfo, // required for 3ds2
      shopperIP, // required by some issuers for 3ds2
      // we pass the orderRef in return URL to get paymentData during redirects
      returnUrl: `http://localhost:8080/api/redirect?orderRef=${orderRef}`, // required for 3ds2 redirect flow
      paymentMethod: req.body.paymentMethod,
      billingAddress: req.body.billingAddress,
    });

    const { action } = response;

    if (action) {
      store.paymentDataStore[orderRef] = action.paymentData;
      const originalHost = new URL(req.headers["referer"]);
      if (originalHost) {
        store.originStore[orderRef] = originalHost.origin;
      }
    }
    console.log('/api/payments', response)
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
};

module.exports = {
  handler,
  url: '/api/payments'
};
