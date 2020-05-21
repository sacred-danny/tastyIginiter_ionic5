import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { config } from '../../config/config';
import { Menu } from '../models/menu';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menu: Menu;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
  }

  getMenu(payload): Observable<Menu> {
    return this.http.post<Menu>(config.apiURL + '/home/menu', payload);
  }

  async getMenuDetail(menuId: string) {
    let res = await this.http.get(config.apiURL + '/home/menu/' + menuId);
    res = await this.commonService.keysToCamel(res);
    return res;
  }
}
