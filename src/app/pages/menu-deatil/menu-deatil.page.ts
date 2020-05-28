import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { config } from '../../config/config';
import { Item, MenuDetailOption, MenuOptions, MenuOptionValue } from '../../core/models/menu';

import { IonContent, NavController } from '@ionic/angular';
import { LoginRequest } from '../../core/models/auth';

@Component({
  selector: 'app-menu-deatil',
  templateUrl: './menu-deatil.page.html',
  styleUrls: [ './menu-deatil.page.scss' ],
})
export class MenuDeatilPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  menuId: string;
  menuDetail: MenuDetailOption;
  menuBlankImage = config.menuBlankImage;
  count = 1;
  price = 0;
  onePirce = 0;
  comment = '';
  showComment = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private commonService: CommonService,
    private navController: NavController,
    private storage: Storage
  ) {
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.menuId = this.activatedRoute.snapshot.paramMap.get('id');
      const payload = {
        id: this.menuId
      };
      this.menuService.getDeatail(payload).subscribe((menuDetail: any) => {
        this.menuDetail = this.commonService.keysToCamel(menuDetail);
        this.price = this.menuDetail.menu.menuPrice;
        this.onePirce = this.menuDetail.menu.menuPrice;
        const options = [];
        // tslint:disable-next-line:forin
        for (const item in this.menuDetail.options) {
          const option: MenuOptions = this.menuDetail.options[item];
          const optionValues = [];
          // tslint:disable-next-line:forin
          for (const optionValueItem in option.optionValues) {
            option.optionValues[optionValueItem].isChecked = false;
            optionValues.push(option.optionValues[optionValueItem]);
          }
          option.optionValues = optionValues;
          options.push(option);
        }
        this.menuDetail.options = options;
        loading.dismiss();
        setTimeout(() => {
          const y = document.getElementById('comment').offsetTop;
          if (y < document.body.offsetHeight - 315) {
            this.showComment = false;
          }
        }, 1);
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

  checkboxClick(item) {
    item.isChecked = ! item.isChecked;
    if (item.isChecked) {
      this.onePirce += item.price;
    } else {
      this.onePirce -= item.price;
    }
    this.calcPrice();
  }

  radioClick(item, optionsValues: Array<MenuOptionValue>) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < optionsValues.length; i ++) {
      if (optionsValues[i].isChecked === true) {
        this.onePirce -= optionsValues[i].price;
      }
    }
    item.isChecked = ! item.isChecked;
    if (item.isChecked) {
      this.onePirce += item.price;
    }
    if (item.isChecked) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < optionsValues.length; i ++) {
        if (optionsValues[i].price !== item.price) {
          optionsValues[i].isChecked = false;
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < optionsValues.length; i ++) {
        optionsValues[i].isChecked = false;
      }
    }
    this.calcPrice();
  }

  orderCount(orderCount) {
    if (this.count === 1 && orderCount === - 1) {
      return;
    }
    this.count += orderCount;
    this.calcPrice();
  }

  calcPrice() {
    this.price = this.onePirce * this.count;
  }

  goComment() {
    const y = document.getElementById('comment').offsetTop;
    this.myContent.scrollToPoint(0, y, 700);
  }

  addOrder() {
    this.menuService.order.totalCount += this.count;
    this.menuService.order.totalPrice += this.price;
    const item: Item = {
      name: this.menuDetail.menu.menuName,
      count: this.count,
      price: this.price,
      comment: this.comment,
      photo: this.menuDetail.menu.menuPhoto,
      extras: ''
    };
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.menuDetail.options.length; i ++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.menuDetail.options[i].optionValues.length; j ++) {
        if (this.menuDetail.options[i].optionValues[j].isChecked) {
          item.extras += this.menuDetail.options[i].optionValues[j].value;
          if (j < this.menuDetail.options[i].optionValues.length - 1) {
            item.extras += ', ';
          }
        }
      }
    }
    this.menuService.order.items.push(item);
    this.storage.set(config.storage.order, this.menuService.order);
    console.log(this.menuService.order);
    this.navController.pop();
  }
}
