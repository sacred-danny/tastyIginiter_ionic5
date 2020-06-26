import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

import { CommonService } from './core/services/common.service';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {

  loading = false;

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public fcm: FCM,
    public router: Router,
    public storage: Storage,
    public keyboard: Keyboard,
    public commonService: CommonService,
    public authService: AuthService
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
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.keyboard.onKeyboardShow().subscribe((e) => {
          const activeEle: any = document.activeElement;
          let offsetTop = activeEle.getBoundingClientRect().top + document.documentElement.scrollTop;
          if (activeEle.type === 'textarea') {
            offsetTop += 70;
          } else {
            offsetTop += 50;
          }
          console.log('keyboard show');
          if (offsetTop > window.innerHeight - e.keyboardHeight) {
            document.body.style.marginTop = (0 - e.keyboardHeight) + 'px';
          }
        });
        this.keyboard.onKeyboardHide().subscribe(e => {
          console.log('keyboard hide');
          document.body.style.marginTop = '0px';
        });
      }
      this.keyboard.hideFormAccessoryBar(false);
    });
  }

  showNotification() {
    this.fcm.getToken().then(async (token) => {
      console.log('firebaseToken:', token);
      await this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onTokenRefresh().subscribe(async (token) => {
      console.log('refreshFirebaseToken:', token);
      await this.storage.set(environment.storage.notificationToken, token);
    });
    this.fcm.onNotification().subscribe(async (data) => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
        await this.router.navigateByUrl('tabs/order');
      } else {
        console.log('Received in foreground');
        await this.commonService.presentAlert(data.title, data.body);
      }
    });
  }

  notificationSetup() {
    if (this.platform.is('ios')) {
      const selfWindow: any = window;
      selfWindow.FCMPlugin.requestPushPermissionIOS(() => {
        this.showNotification();
      }, (e) => {
        console.log('push permissions failed', e);
      });
    } else {
      this.showNotification();
    }
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      if (event.id === 1 && event.url === '/') {
        this.loading = true;
      }
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
