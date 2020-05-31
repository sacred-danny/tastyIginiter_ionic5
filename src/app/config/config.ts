// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `config.ts` with `config.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const config = {
  production: false,
  addressKey: 'h8oJpLQObUWNXeSh4vtDiw25701',

  // serverURL: 'http://www.grubsupdev.com/',
  // apiURL: 'http://www.grubsupdev.com/api/v1',

  serverURL: 'http://localhost/grubsupdev/',
  apiURL: 'http://localhost/grubsupdev/api/v1',
  stripeApiKey: 'pk_test_KGSgL4Ccd2oGEKsSYXBF4SD600LfoqUiWa',

  menuBlankImage: 'https://via.placeholder.com/60',
  storage: {
    token: 'token',
    user: 'user',
    order: 'order'
  },
  baseColors: {
    burningOrage: '#fc6c35',
    pistachio: '#8FD400'
  }
};

/*
 * For easier debugging in development mode, you can import the folloiwing file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
