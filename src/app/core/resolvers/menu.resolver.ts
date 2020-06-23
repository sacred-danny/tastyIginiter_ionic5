import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Menu } from '../models/menu';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { keysToCamel } from '../utils/dto.util';

@Injectable({
  providedIn: 'root'
})
export class MenuResolver implements Resolve<Menu> {

  constructor(
    public menuService: MenuService,
    public authService: AuthService,
    public commonService: CommonService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> | Promise<Menu> | Menu {
    this.menuService.getOrder();
    if (this.menuService.menu && this.menuService.menu.locationId === this.authService.user.locationId) {
      return this.menuService.menu;
    } else {
      return new Promise(async (resolve) => {
        const payload = {
          user: this.authService.user
        };
        const res = await this.menuService.getMenu(payload).toPromise();
        this.menuService.menu = keysToCamel(res);
        resolve(res);
      });
    }
  }

}
