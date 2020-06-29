import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public commonService: CommonService,
    public menuService: MenuService,
    public router: Router,
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.authService.token = await this.authService.getToken();
    // if ( ! this.authService.getInfo()) {
    //   navigator['app'].exitApp();
    // }
    let flag: boolean = await this.authService.isAuthenticated();
    if ( ! flag) {
      this.authService.user = undefined;
      await this.router.navigate([ '/login' ], { replaceUrl: true });
      return false;
    }

    this.authService.user = await this.authService.getUser();
    this.authService.locations = await this.authService.getLocations();
    flag = await this.authService.isLocationExist();
    if ( ! flag) {
      await this.router.navigate([ '/set-location' ]);
    }
    return flag;
  }

}
