import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { config } from '../../config/config';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { Coupon, Item } from '../../core/models/menu';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.page.html',
  styleUrls: [ './your-order.page.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YourOrderPage implements OnInit, AfterContentChecked {
  backGroundColor = config.baseColors.burningOrage;
  menuBlankImage = config.menuBlankImage;
  discount = 0;
  discountType = '';
  delivery = 0;
  currentPrice = 0;
  coupons: Array<Coupon>;
  discountCode = '';

  constructor(
    private menuService: MenuService,
    private storage: Storage,
    private navController: NavController,
    private ref: ChangeDetectorRef,
    private commonService: CommonService,
    private router: Router
  ) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.coupons = new Array();
    // tslint:disable-next-line:forin
    for (const item in this.menuService.menu.coupons) {
      this.coupons.push(this.menuService.menu.coupons[item]);
    }

    if (this.menuService.menu.deliveryTotal === 0) {
      this.delivery = 0;
    } else {
      if (this.menuService.order.totalPrice >= this.menuService.menu.deliveryTotal) {
        this.delivery = 0;
      } else {
        this.delivery = this.menuService.menu.deliveryAmount;
      }
    }

    this.calcPrice();

  }

  checkOut() {
    this.router.navigateByUrl('checkout');
  }

  calcPrice() {
    if (this.discountType === 'P') {
      if (this.menuService.order.totalPrice / 100 * this.discount - this.delivery >= 0) {
        this.currentPrice = this.menuService.order.totalPrice / 100 * this.discount - this.delivery;
      } else {
        this.currentPrice = 0;
      }
    } else {
      if (this.discountType === 'F') {
        if (this.menuService.order.totalPrice - this.discount < 0) {
          this.commonService.presentAlert('Warning', 'Your discount code can not be applied on orders below £' + this.discount);
          return;
        } else {
          if (this.menuService.order.totalPrice - this.discount - this.delivery >= 0) {
            this.currentPrice = this.menuService.order.totalPrice - this.discount - this.delivery;
          } else {
            this.currentPrice = 0;
          }
        }
      } else {
        this.currentPrice = this.menuService.order.totalPrice - this.discount - this.delivery;
      }
    }
  }

  couponApply() {
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.coupons.length; i ++) {
      if (this.coupons[i].code === this.discountCode) {
        found = true;
        this.discountType = this.coupons[i].type;
        this.discount = this.coupons[i].discount;
        this.calcPrice();
        break;
      }
    }
    if ( ! found) {
      this.discount = 0;
      this.discountType = '';
      this.calcPrice();
      this.commonService.presentAlert('Warning', 'Please enter a valid discount code. ');
      return;
    }
  }

  delete(index) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.menuService.order.items.length; i ++) {
      if (i === index) {
        this.menuService.order.totalPrice -= this.menuService.order.items[i].price;
        this.menuService.order.totalCount -= this.menuService.order.items[i].count;
      }
    }
    const items: Array<Item> = new Array();
    for (let i = 0; i < this.menuService.order.items.length; i ++) {
      if (i !== index) {
        items.push(this.menuService.order.items[i]);
      }
    }
    this.menuService.order.items = items;
    this.storage.set(config.storage.order, this.menuService.order);
    this.calcPrice();
  }
}
