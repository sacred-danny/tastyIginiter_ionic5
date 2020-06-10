import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { CommonService } from './core/services/common.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {
  loading = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private router: Router,
    private storage: Storage,
    private commonService: CommonService
  ) {
    this.initializeApp();

    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetup();
    });
  }

  notificationSetup() {
    this.fcm.getToken().then(token => {
      console.log('firebaseToken:', token);
      this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('refreshFirebaseToken:', token);
      this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
        this.commonService.presentAlert('Success', JSON.stringify(data));
      } else {
        console.log('Received in foreground');
        this.commonService.presentAlert('Success', JSON.stringify(data));
      }
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      if (event.id === 1 && event.url === '/') {
        this.loading = true;
      }
      // this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }
    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
