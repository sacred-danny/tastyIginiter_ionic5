import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { AuthService } from '../../../core/services/auth.service';
import { MenuService } from '../../../core/services/menu.service';
import { CommonService } from '../../../core/services/common.service';
import { environment } from '../../../../environments/environment';
import { Location } from '../../../core/models/auth';

@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit {

  selectLocationId = '';
  constructor(
    public navController: NavController,
    public router: Router,
    public authService: AuthService,
    public menuService: MenuService,
    public commonService: CommonService,
    public storage: Storage
  ) { }

  ngOnInit() {
    if (this.authService.locations.length > 0) {
      this.selectLocationId = this.authService.locations[0].locationId;
    }
  }

  async back() {
    await this.navController.pop();
  }

  async continue() {
    if (this.selectLocationId === '') {
      await this.commonService.presentAlert('Warning', 'There are currently no stores available.');
      return;
    }

    let selectedLocation: Location = {
      locationId: '',
      locationName: '',
      offerDelivery: false,
      offerCollection: false
    };
    this.authService.locations.forEach(location => {
      if (location.locationId === this.selectLocationId) {
        selectedLocation = location;
      }
    });

    if (selectedLocation) {
      this.authService.user.locationId = this.selectLocationId;
      await this.storage.set(environment.storage.user, this.authService.user);
      const loading = await this.commonService.showLoading('Please wait...');
      try {
        const res = await this.authService.setLocation(this.authService.user.locationId);
        this.authService.user.areaId = '';
        this.authService.user.deliveryAddress = '';
        await this.storage.set(environment.storage.user, this.authService.user);
        if (res.offerDelivery === true) {
          await this.router.navigate([ '/set-address' ]);
        } else if (res.offerDelivery === false && res.offerCollection === true) {
          await this.router.navigate([ '' ], { replaceUrl: true });
        } else {
          await this.commonService.presentAlert('Warning', 'This store is not currently taking orders.');
        }
      } catch (e) {
        if (e.status === 500) {
          await this.commonService.presentAlert('Warning', 'Internal Server Error');
        } else {
          await this.commonService.presentAlert('Warning', e.error.message);
        }
      } finally {
        await loading.dismiss();
      }
    }
  }

}
