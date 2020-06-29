import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Location } from '../models/auth';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Storage } from '@ionic/storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationResolver implements Resolve<Array<Location>> {

  constructor(
    public authService: AuthService,
    public commonService: CommonService,
    public storage: Storage
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Array<Location>> | Promise<Array<Location>> | Array<Location> {
    return new Promise(async (resolve) => {
      const res: Array<Location> = await this.authService.getLocation().toPromise();
      this.authService.locations = res;
      await this.storage.set(environment.storage.locations, this.authService.locations);
      resolve(res);
    });
  }

}
