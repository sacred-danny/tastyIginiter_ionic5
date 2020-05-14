import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.authService.token = await this.authService.getToken();
    let flag = await this.authService.isAuthenticated();
    if (!flag) {
      await this.router.navigate(['/login']);
      return flag;
    }
    this.authService.user = await this.authService.getUser();
    flag = await this.authService.isLocationExist();
    if (!flag) {
      await this.router.navigate(['/set-location']);
    }
    return flag;
  }
}
