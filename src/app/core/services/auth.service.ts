import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { config } from '../../config/config';
import { CommonService } from './common.service';

import { LoginRequest, LoginResponse, SetLocationRequest, SignUpRequest, User } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  token: string;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private  commonService: CommonService
  ) {
  }

  async signin(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const res: LoginResponse = await this.http.post<LoginResponse>('/api/v1/signin', payload).toPromise();
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
      const res: LoginResponse = await this.http.post<LoginResponse>('/api/v1/signup', payload).toPromise();
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

  async setLocation(payload: SetLocationRequest) {
    try {
      // tslint:disable-next-line:max-line-length
      const url = 'https://api.getAddress.io/find/' + payload.postCode + '/' + payload.houseNumber + '?expand=true&api-key=' + config.addressKey;
      const addressInfo: any = await this.http.get(url).toPromise();
      payload.address = {
        customer_id: this.user.id,
        // tslint:disable-next-line:max-line-length
        address_1: addressInfo.addresses[0].line_1,
        address_2: '',
        postcode: payload.postCode,
        city: addressInfo.addresses[0].town_or_city,
        state: addressInfo.addresses[0].county,
        // @ts-ignore
        country_id: (addressInfo.addresses[0].country === 'England') ? '222' : addressInfo.addresses[0].country
      };

      const res: LoginResponse = await this.http.post<LoginResponse>('/api/v1/set_location', payload).toPromise();
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
