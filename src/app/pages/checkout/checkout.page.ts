import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { config } from '../../config/config';
import { CheckOutTime, MenuOptions } from '../../core/models/menu';
import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: [ './checkout.page.scss' ],
})
export class CheckoutPage implements OnInit {
  backGroundColor = config.baseColors.burningOrage;
  isSelected = 'delivery';
  pickupTimes: Array<CheckOutTime>;
  deliveryTimes: Array<CheckOutTime>;

  user = {
    id: 16,
    areaId: 1
  };

  pickupTime = {
    id: 0,
    displayDate: '',
    displayOrderTime: '',
    date: '',
    orderTime: ''
  };

  deliveryTime = {
    id: 0,
    displayDate: '',
    displayOrderTime: '',
    date: '',
    orderTime: ''
  };

  comment = '';

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService,
    private menuService: MenuService,
    private navController: NavController
  ) {
  }

  setTime(deliveryIndex = null, pickupIndex = null) {
    if (deliveryIndex != null) {
      this.deliveryTime.id = this.deliveryTimes[deliveryIndex].id;
      this.deliveryTime.date = this.deliveryTimes[deliveryIndex].date;
      this.deliveryTime.orderTime = this.deliveryTimes[deliveryIndex].times[0].orderTime;
      this.deliveryTime.displayDate = this.deliveryTimes[deliveryIndex].weekDay + ' - ' + this.deliveryTimes[deliveryIndex].day;
      this.deliveryTime.displayOrderTime = this.deliveryTimes[deliveryIndex].times[0].showTime;
    }
    if (pickupIndex != null) {
      this.pickupTime.id = this.pickupTimes[pickupIndex].id;
      this.pickupTime.date = this.pickupTimes[pickupIndex].date;
      this.pickupTime.orderTime = this.pickupTimes[pickupIndex].times[0].orderTime;
      this.pickupTime.displayDate = this.pickupTimes[pickupIndex].weekDay + ' - ' + this.pickupTimes[pickupIndex].day;
      this.pickupTime.displayOrderTime = this.pickupTimes[pickupIndex].times[0].showTime;
    }
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.menuService.getCheckOutTime({user: this.user}).subscribe((checkOutTime: any) => {
        this.deliveryTimes = checkOutTime.delivery;
        this.pickupTimes = checkOutTime.pickup;
        this.setTime(0, 0);
        loading.dismiss();
      });
    } catch (e) {
      console.log(e);
      this.navController.pop();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    } finally {
      await loading.dismiss();
    }
  }

  deliveryDateChanged() {
    for (let i = 0; i < this.deliveryTimes.length; i++) {
      if (this.deliveryTime.displayDate === this.deliveryTimes[i].weekDay + ' - ' + this.deliveryTimes[i].day) {
        this.setTime(i);
        break;
      }
    }
  }

  deliveryTimeChanged() {
    this.deliveryTime.orderTime = this.deliveryTime.displayOrderTime.split('-')[0] + ':00';
  }

  pickupDateChanged() {
    for (let i = 0; i < this.pickupTimes.length; i++) {
      if (this.pickupTime.displayDate === this.pickupTimes[i].weekDay + ' - ' + this.pickupTimes[i].day) {
        this.setTime(null, i);
        break;
      }
    }
  }

  pickupTimeChanged() {
    this.pickupTime.orderTime = this.pickupTime.displayOrderTime.split('-')[0] + ':00';
  }

  checkout() {
    this.router.navigateByUrl('stripe-javascript');
  }

  delivery() {
    this.isSelected = 'delivery';
  }

  pickup() {
    this.isSelected = 'pickup';
  }
}
