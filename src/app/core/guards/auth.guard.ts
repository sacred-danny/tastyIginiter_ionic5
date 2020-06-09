import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.authService.token = await this.authService.getToken();
    const flag: number = await this.authService.isAuthenticated();
    if (flag === - 1) {
      await this.commonService.presentAlert('Warning', 'Your account is disabled, please contact us.');
      await this.router.navigate([ '/login' ]);
      return false;
    }
    if (flag === 0) {
      await this.router.navigate([ '/login' ]);
      return false;
    }

    this.authService.user = await this.authService.getUser();
    const isLocationExist: boolean = await this.authService.isLocationExist();
    if ( ! isLocationExist) {
      await this.router.navigate([ '/set-location' ]);
      return isLocationExist;
    }
    return isLocationExist;
  }
}
