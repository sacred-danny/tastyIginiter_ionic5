import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { environment } from '../../../environments/environment';

import { CommonService } from '../../core/services/common.service';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: [ './order.page.scss' ],
})
export class OrderPage implements OnInit {
  serverConfig = environment;
  orders: any;

  constructor(
    private commonService: CommonService,
    private menuService: MenuService,
    private authService: AuthService,
    private navController: NavController
  ) {
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const result = await this.menuService.getOrders({ user: this.authService.user }).toPromise();
      const orders = this.commonService.keysToCamel(result.orders);
      this.orders = Array();
      // tslint:disable-next-line:prefer-for-of forin
      for (const order in orders) {
        this.orders.push(orders[order]);
      }
      loading.dismiss();
    } catch (e) {
      loading.dismiss();
      this.navController.pop();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  ionViewWillEnter() {
    this.commonService.activeIcon(2);
  }
}
