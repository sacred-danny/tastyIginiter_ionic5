import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { config } from '../../config/config';
import { CommonService } from './common.service';
import { parseToPayload } from '../utils/dto.util';
import { anonParam } from '../utils/api.util';

import { LoginRequest, LoginResponse, SetLocationRequest, PrepareLocationRequest, SignUpRequest, User } from '../models/auth';
import { filterErrorsAndWarnings } from '@angular/compiler-cli';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  token: string;

  tokenChanged$: Subject<boolean> = new Subject<boolean>();
  userChanged$: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private  commonService: CommonService
  ) {
  }

  getToken(): Promise<string> {
    return this.storage.get(config.storage.token);
  }

  getUser(): Promise<User> {
    return this.storage.get(config.storage.user);
  }

  async isAuthenticated(): Promise<boolean> {
    const localUser = await this.getUser();
    const payload = {
      user: localUser
    };
    // tslint:disable-next-line:ban-types
    const res: boolean = await this.http.post<boolean>('api/v1/auth/validateToken', payload).toPromise();
    return  res;
  }

  isLocationExist(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // tslint:disable-next-line:no-shadowed-variable
      this.getUser().then(user => {
        if (user.areaID == null || user.areaID === '') {
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch(err => {
        resolve(false);
      });
    });
  }

  async signin(payload: LoginRequest): Promise<LoginResponse> {
    try {
      // tslint:disable-next-line:max-line-length
      const res: LoginResponse = await this.http.post<LoginResponse>('api/v1/auth/signIn', parseToPayload(payload), {params: anonParam()}).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(config.storage.token, res.token);
      await this.storage.set(config.storage.user, res.user);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async signup(payload: SignUpRequest): Promise<LoginResponse> {
    try {
      // tslint:disable-next-line:max-line-length
      const res: LoginResponse = await this.http.post<LoginResponse>('api/v1/auth/signUp', parseToPayload(payload), {params: anonParam()}).toPromise();
      console.log(res);
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(config.storage.token, res.token);
      await this.storage.set(config.storage.user, res.user);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async setLocation(beforePayload: PrepareLocationRequest) {
    try {
      // tslint:disable-next-line:max-line-length
      const url = 'https://api.getAddress.io/find/' + beforePayload.postcode + '/' + beforePayload.houseName + '?expand=true&api-key=' + config.addressKey;
      const addressInfo: any = await this.http.get(url).toPromise();
      const payload = {
        user: this.user,
        address: {
            address1: addressInfo.addresses[0].line_1,
            address2: '',
            postcode: beforePayload.postcode,
            city: addressInfo.addresses[0].town_or_city,
            state: addressInfo.addresses[0].county,
            countryID: (addressInfo.addresses[0].country === 'England') ? '222' : addressInfo.addresses[0].country
        }
      };
      const res: LoginResponse = await this.http.post<LoginResponse>('api/v1/auth/setLocation', payload).toPromise();
      this.user = res.user;
      this.token = res.token;
      // save token to the storage
      await this.storage.set(config.storage.token, res.token);
      await this.storage.set(config.storage.user, res.user);
      return res;

    } catch (e) {
      throw e;
    }
  }

  async logout() {
    await this.storage.clear();
    await this.router.navigate([ '/login' ], { replaceUrl: true });
  }
}
