import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';

import { config } from '../../config/config';
import { Menu, Order } from '../models/menu';
import { CommonService } from './common.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menu: Menu;
  order: Order;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private storage: Storage,
    private navController: NavController
  ) {
  }

  getOrder() {
    this.storage.get(config.storage.order).then((val) => {
      if (val === null) {
        this.order = {
          totalCount: 0,
          totalPrice: 0,
          items: new Array(),
        };
      } else {
        this.order = val;
      }
    });
  }

  getMenu(payload): Observable<Menu> {
    return this.http.post<Menu>(config.apiURL + '/home/menu', payload);
  }

  getDeatail(payload): Observable<any> {
    return this.http.post<any>(config.apiURL + '/home/menuDetail', payload);
  }

  getCheckOutTime(payload): Observable<any> {
    return this.http.post<any>(config.apiURL + '/home/getCheckOutTime', payload);
  }
}
