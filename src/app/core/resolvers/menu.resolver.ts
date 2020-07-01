import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
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
    public commonService: CommonService,
    public router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> | Promise<Menu> | Menu {
    this.menuService.getOrder();
    return new Promise(async (resolve) => {
      const payload = {
        user: this.authService.user
      };
      const res = await this.menuService.getMenu(payload).toPromise();
      this.menuService.menu = keysToCamel(res);
      if (this.menuService.menu.offerCollection === false && this.menuService.menu.offerDelivery === false) {
        await this.router.navigate([ '/set-location' ], { replaceUrl: true });
      }
      this.commonService.activeIcon(0);
      resolve(res);
    });
  }

}
