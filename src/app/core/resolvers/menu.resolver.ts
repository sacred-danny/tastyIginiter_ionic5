import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Menu } from '../models/menu';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class MenuResolver implements Resolve<Menu> {

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> | Promise<Menu> | Menu {
    if (this.menuService.menu) {
      return this.menuService.menu;
    } else {
      return new Promise(async (resolve) => {
        const payload = {
          user: this.authService.user
        };
        const res = await this.menuService.getMenu(payload).toPromise();
        this.menuService.menu = this.commonService.keysToCamel(res);
        resolve(res);
      });
    }
  }
}
