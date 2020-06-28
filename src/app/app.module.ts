import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { CommonKitModule } from './ui-kit/common-kit/common-kit.module';
import { InputModule } from './ui-kit/input/input.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { pageTransition } from './core/utils/transition.util';

@NgModule({
  declarations: [ AppComponent ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ navAnimation: pageTransition }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    CommonKitModule,
    InputModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    FCM,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthInterceptor }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
