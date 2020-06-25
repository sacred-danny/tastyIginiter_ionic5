import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import { environment } from '../../../environments/environment';

import { CommonService } from '../../core/services/common.service';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import { associateArrayToArray, keysToCamel } from '../../core/utils/dto.util';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: [ './order.page.scss' ],
})
export class OrderPage implements OnInit {

  @ViewChild('refresherRef') refresherRef;

  serverConfig = environment;
  orders: any;

  constructor(
    public commonService: CommonService,
    public menuService: MenuService,
    public authService: AuthService,
    public navController: NavController
  ) {
  }

  async ngOnInit() {
    if (this.commonService.isInit) {
      await this.ionViewWillEnter();
    }
  }

  async ionViewWillEnter() {
    this.commonService.activeIcon(2);
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const result = await this.menuService.getOrders({ user: this.authService.user }).toPromise();
      const orders = keysToCamel(result.orders);
      this.orders = associateArrayToArray(orders);
      if (this.orders.length === 0) {
        await this.commonService.presentAlert('Warning', 'You don’t have any previous orders.');
      }
    } catch (e) {
      await this.navController.pop();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

  doRefresh() {
    setTimeout(async () => {
      const result = await this.menuService.getOrders({ user: this.authService.user }).toPromise();
      this.orders = associateArrayToArray(keysToCamel(result.orders));
      this.refresherRef.complete();
    }, 10);
  }

}
