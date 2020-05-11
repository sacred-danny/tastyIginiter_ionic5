// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `config.ts` with `config.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const config = {
  production: false,
  api: 'http://localhost/grub/api/v1',
  addressKey: 'h8oJpLQObUWNXeSh4vtDiw25701',
  storage: {
    token: 'token',
    user: 'user'
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
