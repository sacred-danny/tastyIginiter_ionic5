export const environment = {
  production: true,
  enableLog: true,
  addressKey: 'h8oJpLQObUWNXeSh4vtDiw25701',
  supportPhoneNumber: '07833360935',
  supportDialCode: '+447833360935',

  serverURL: 'https://www.grubsupdev.com/',
  apiURL: 'https://www.grubsupdev.com/api/v1',

  // serverURL: 'http://192.168.108.123/grubsupdev/',
  // apiURL: 'http://192.168.108.123/grubsupdev/api/v1',

  stripeApiKey: 'pk_test_KGSgL4Ccd2oGEKsSYXBF4SD600LfoqUiWa',

  debitCardURL: 'assets/media/debitcards/',
  menuBlankImage: 'https://via.placeholder.com/60',

  storage: {
    token: 'token',
    user: 'user',
    order: 'order',
    notificationToken: 'notificationToken'
  },
  baseColors: {
    burningOrange: '#fc6c35',
    pistachio: '#8FD400'
  },
  stripeElementStyles: {
    style: {
      base: {
        iconColor: '#c4f0ff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        lineHeight: '22px',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  }
};
