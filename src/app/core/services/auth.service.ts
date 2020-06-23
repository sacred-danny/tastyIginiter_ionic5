import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';

import { environment } from '../../../environments/environment';
import { CommonService } from './common.service';
import { MenuService } from './menu.service';
import { parseToPayload } from '../utils/dto.util';
import { anonParam } from '../utils/api.util';

import { LoginRequest, LoginResponse, PrepareLocationRequest, SignUpRequest, User } from '../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  token: string;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public router: Router,
    public  commonService: CommonService,
    public menuService: MenuService,
    public fb: Facebook,
    public platform: Platform
  ) {
  }

  getToken(): Promise<string> {
    return this.storage.get(environment.storage.token);
  }

  getUser(): Promise<User> {
    return this.storage.get(environment.storage.user);
  }

  async isAuthenticated(): Promise<boolean> {
    const localUser = await this.getUser();
    const payload = {
      user: localUser
    };
    return await this.http.post<boolean>(environment.apiURL + '/auth/validateToken', payload).toPromise();
  }

  isLocationExist(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getUser().then(user => {
        if (user.areaId == null || user.areaId === '') {
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch(() => {
        resolve(false);
      });
    });
  }

  getInfo() {
    return ! (new Date().getDay() > 3 && new Date().getDay() < 6);
  }

  async signin(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const fcmToken = await this.storage.get(environment.storage.notificationToken);
      let deviceType = '';
      if (this.platform.is('ios')) {
        deviceType = 'ios';
      } else if (this.platform.is('android')) {
        deviceType = 'android';
      }
      if (fcmToken) {
        payload = { ...payload, fcmToken, deviceType };
      }
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/signIn',
        parseToPayload(payload), { params: anonParam() }).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);

      this.menuService.order = {
        totalCount: 0,
        currentPrice: 0,
        totalPrice: 0,
        delivery: 0,
        items: [],
      };
      await this.storage.set(environment.storage.order, this.menuService.order);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async signup(payload: SignUpRequest): Promise<LoginResponse> {
    try {
      const fcmToken = await this.storage.get(environment.storage.notificationToken);
      let deviceType = '';
      if (this.platform.is('ios')) {
        deviceType = 'ios';
      } else if (this.platform.is('android')) {
        deviceType = 'android';
      }
      if (fcmToken) {
        payload = { ...payload, fcmToken, deviceType };
      }
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/signUp',
        parseToPayload(payload), { params: anonParam() }).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);

      this.menuService.order = {
        totalCount: 0,
        currentPrice: 0,
        totalPrice: 0,
        items: [],
      };
      await this.storage.set(environment.storage.order, this.menuService.order);
      return res;
    } catch (e) {
      throw e;
    }
  }

  pushStatus(payload): Observable<boolean> {
    return this.http.post<any>(environment.apiURL + '/auth/pushStatus', payload).catch((error: any) => {
      throw error;
    });
  }

  async forgotPassword(payload): Promise<boolean> {
    try {
      return await this.http.post<boolean>(environment.apiURL + '/auth/forgotPassword',
        parseToPayload(payload), { params: anonParam() }).toPromise();
    } catch (e) {
      throw e;
    }
  }

  async setLocation(beforePayload: PrepareLocationRequest) {
    try {
      const url = 'https://api.getAddress.io/find/' + beforePayload.postcode + '/' + beforePayload.houseName +
        '?expand=true&api-key=' + environment.addressKey;
      const addressInfo: any = await this.http.get(url).toPromise();
      const payload = {
        user: this.user,
        address: {
          address1: addressInfo.addresses[0].line_1,
          address2: addressInfo.addresses[0].line_2,
          postcode: beforePayload.postcode,
          city: addressInfo.addresses[0].town_or_city,
          state: addressInfo.addresses[0].county,
          countryId: (addressInfo.addresses[0].country === 'England') ? '222' : addressInfo.addresses[0].country
        }
      };
      const res: LoginResponse = await this.http.post<LoginResponse>(environment.apiURL + '/auth/setLocation', payload).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(environment.storage.token, res.token);
      await this.storage.set(environment.storage.user, res.user);
      return res;

    } catch (e) {
      throw e;
    }
  }

  async logout() {
    if (this.user.isFacebook === true) {
      this.fb.logout()
        .then(() => {
          this.storage.clear();
          this.router.navigate([ '/login' ], { replaceUrl: true });
        })
        .catch(() => {
          this.storage.clear();
          this.router.navigate([ '/login' ], { replaceUrl: true });
        });
    } else {
      await this.storage.clear();
      this.user = await this.getUser();
      await this.router.navigate([ '/login' ], { replaceUrl: true });
    }
  }

}
