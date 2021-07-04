const handler = store => async (req, res) => {
  try {
    const response = await store.checkout.paymentMethods({
      channel: "Web",
      merchantAccount: store.appConfig.MERCHANT_ACCOUNT,
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
};

module.exports = {
  handler,
  url: '/api/paymentMethods'
};

