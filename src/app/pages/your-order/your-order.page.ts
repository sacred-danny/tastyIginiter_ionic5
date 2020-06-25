import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { Coupon, Item } from '../../core/models/menu';
import { environment } from '../../../environments/environment';
import { associateArrayToArray } from '../../core/utils/dto.util';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.page.html',
  styleUrls: [ './your-order.page.scss' ],
})
export class YourOrderPage implements OnInit {

  serverConfig = environment;
  menuBlankImage = environment.menuBlankImage;
  discount = 0;
  discountType = '';
  delivery = 0;
  currentPrice = 0;
  coupons: Array<Coupon>;
  discountCode = '';

  constructor(
    public menuService: MenuService,
    public storage: Storage,
    public navController: NavController,
    public commonService: CommonService,
    public router: Router
  ) {
  }

  async ngOnInit() {
    this.coupons = associateArrayToArray(this.menuService.menu.coupons);
    if (this.menuService.menu.deliveryTotal === 0 || this.menuService.order.totalPrice === 0 && this.menuService.order.totalCount === 0) {
      this.delivery = 0;
    } else {
      if (this.menuService.order.totalPrice >= Number(this.menuService.menu.deliveryTotal)
        && Number(this.menuService.menu.deliveryTotal) !== 0) {
        this.delivery = 0;
      } else {
        this.delivery = Number(this.menuService.menu.deliveryAmount);
      }
    }
    await this.calcPrice();
  }

  async checkOut() {
    this.menuService.order.delivery = this.delivery;
    this.menuService.order.currentPrice = this.currentPrice;
    await this.storage.set(environment.storage.order, this.menuService.order);
    await this.router.navigateByUrl('checkout');
  }

  async calcPrice() {
    if (this.discountType === 'P') {
      this.menuService.order.totalPrice = this.menuService.order.totalPrice / 100 * (100 - this.discount);
      this.currentPrice = this.menuService.order.totalPrice + this.delivery;
    } else {
      if (this.discountType === 'F') {
        if (this.menuService.order.totalPrice - this.discount + this.delivery < 0) {
          const discount = this.discount;
          await this.commonService.presentAlert('Warning', 'Your discount code can not be applied on orders below £' + discount);
          this.discount = 0;
          return;
        } else {
          this.menuService.order.totalPrice -= this.discount;
          this.currentPrice = this.menuService.order.totalPrice + this.delivery;
        }
      } else {
        if (this.menuService.order.totalPrice - this.discount + this.delivery > 0) {
          this.menuService.order.totalPrice -= this.discount;
          this.currentPrice = this.menuService.order.totalPrice + this.delivery;
        } else {
          this.currentPrice = 0;
        }
      }
    }
  }

  async couponApply() {
    let found = false;
    Object.keys(this.coupons).forEach(i => {
      if (this.coupons[i].code === this.discountCode) {
        found = true;
        this.commonService.presentAlert('Success', 'Your discount has been applied.');
        this.discountType = this.coupons[i].type;
        this.discount = this.coupons[i].discount;
        this.calcPrice();
      }
    });
    if ( ! found) {
      this.discount = 0;
      this.discountType = '';
      await this.calcPrice();
      await this.commonService.presentAlert('We’re Sorry', 'Your discount code has expired or is invalid.');
      return;
    }
  }

  async delete(index) {
    Object.keys(this.menuService.order.items).forEach(i => {
      if (Number(i) === index) {
        this.menuService.order.totalPrice -= this.menuService.order.items[i].price;
        this.menuService.order.totalCount -= this.menuService.order.items[i].count;
      }
    });
    const items: Array<Item> = [];
    Object.keys(this.menuService.order.items).forEach(i => {
      if (Number(i) !== index) {
        items.push(this.menuService.order.items[i]);
      }
    });
    this.menuService.order.items = items;
    if (this.menuService.menu.deliveryTotal === 0 || this.menuService.order.totalPrice === 0 && this.menuService.order.totalCount === 0) {
      this.delivery = 0;
    } else {
      if (this.menuService.order.totalPrice >= Number(this.menuService.menu.deliveryTotal)) {
        this.delivery = 0;
      } else {
        this.delivery = Number(this.menuService.menu.deliveryAmount);
      }
    }
    await this.storage.set(environment.storage.order, this.menuService.order);
    await this.calcPrice();
  }
}
