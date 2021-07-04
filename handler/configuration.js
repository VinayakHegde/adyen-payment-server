const handler = store => async (req, res) => {
  res.json({
    paymentMethodsConfiguration: {
      ideal: {
        showImage: true,
      },
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        name: "Credit or debit card",
        amount: {
          value: 1000, // 10€ in minor units
          currency: "GBP",
        },
      },
    },
    locale: "en_GB",
    showPayButton: true,
    clientKey: store.appConfig.CLIENT_KEY,
    environment: "test",
  });
};

module.exports = {
  handler,
  url: '/api/config'
};
