import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { MenuService } from '../../core/services/menu.service';
import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { Item, MenuDetailOption, MenuOptionValue } from '../../core/models/menu';
import { associateArrayToArray, keysToCamel } from '../../core/utils/dto.util';

@Component({
  selector: 'app-menu-deatil',
  templateUrl: './menu-deatil.page.html',
  styleUrls: [ './menu-deatil.page.scss' ],
})
export class MenuDeatilPage implements OnInit {

  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;

  menuId: string;
  menuDetail: MenuDetailOption;
  menuBlankImage = environment.menuBlankImage;
  count = 1;
  price = 0;
  onePrice = 0;
  comment = '';
  showComment = true;
  isOrder = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public menuService: MenuService,
    public authService: AuthService,
    public commonService: CommonService,
    public navController: NavController,
    public router: Router,
    public platform: Platform,
    public storage: Storage
  ) {
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.menuId = this.activatedRoute.snapshot.paramMap.get('id');
      const payload = {
        id: this.menuId,
        userId: this.authService.user.id
      };
      const menuDetail = await this.menuService.getDeatail(payload).toPromise();
      this.menuDetail = keysToCamel(menuDetail);
      this.price = this.menuDetail.menu.menuPrice;
      this.onePrice = this.menuDetail.menu.menuPrice;
      this.menuDetail.options = associateArrayToArray(this.menuDetail.options);
      Object.keys(this.menuDetail.options).forEach(i => {
        Object.keys(this.menuDetail.options[i]).forEach(key => {
          if (key === 'optionValues') {
            this.menuDetail.options[i][key] = associateArrayToArray(this.menuDetail.options[i][key]);
            Object.keys(this.menuDetail.options[i][key]).forEach(subkey => {
              this.menuDetail.options[i][key][subkey] = {
                ...this.menuDetail.options[i][key][subkey],
                isChecked: false
              };
            });
          }
        });
      });
      await setTimeout(() => {
        const y = document.getElementById('comment').offsetTop;
        if (y < document.body.offsetHeight - 315) {
          this.showComment = false;
        }
      }, 1);
    } catch (e) {
      await this.router.navigate([ '/login' ], { replaceUrl: true });
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

  async addFavorite() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload = {
        id: this.menuId,
        userId: this.authService.user.id
      };
      const res = await this.menuService.addFavorite(payload).toPromise();
      if (res) {
        this.menuDetail.menu.isFavorite = true;
        await this.commonService.presentAlert('Success', 'Added to your favourites.');
      } else {
        this.menuDetail.menu.isFavorite = false;
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

  checkboxClick(item) {
    item.isChecked = ! item.isChecked;
    if (item.isChecked) {
      this.onePrice += item.price;
    } else {
      this.onePrice -= item.price;
    }
    this.calcPrice();
  }

  radioClick(item, optionsValues: Array<MenuOptionValue>) {
    Object.keys(optionsValues).forEach(i => {
      if (optionsValues[i].isChecked === true) {
        this.onePrice -= optionsValues[i].price;
      }
    });
    item.isChecked = ! item.isChecked;
    if (item.isChecked) {
      this.onePrice += item.price;
    }
    if (item.isChecked) {
      Object.keys(optionsValues).forEach(i => {
        if (optionsValues[i].price !== item.price) {
          optionsValues[i].isChecked = false;
        }
      });
    } else {
      Object.keys(optionsValues).forEach(i => {
        optionsValues[i].isChecked = false;
      });
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
    this.price = this.onePrice * this.count;
  }

  async goComment() {
    const container = document.getElementById('container');
    await container.scrollTo(0, container.scrollHeight);
  }

  async addOrder() {

    if (this.menuService.menu.offerDelivery === false && this.menuService.menu.offerCollection === false) {
      await this.commonService.presentAlert('Warning', 'This store is not currently taking orders.');
      return;
    }
    if (this.isOrder === false) {
      this.isOrder = true;
      this.menuService.order.totalCount += this.count;
      this.menuService.order.totalPrice += this.price;
      const item: Item = {
        name: this.menuDetail.menu.menuName,
        menuId: this.menuDetail.menu.menuId,
        quantity: this.count,
        price: this.menuDetail.menu.menuPrice,
        subtotal: this.price,
        comment: this.comment,
        photo: this.menuDetail.menu.menuImageUrl,
        extrasTitle: '',
        extras: []
      };
      Object.keys(this.menuDetail.options).forEach(i => {
        Object.keys(this.menuDetail.options[i].optionValues).forEach(j => {
          if (this.menuDetail.options[i].optionValues[j].isChecked) {
            item.extrasTitle += this.menuDetail.options[i].optionValues[j].value;
            const extra = {
              orderId: '',
              menuId: this.menuDetail.menu.menuId,
              orderOptionName: this.menuDetail.options[i].optionValues[j].value,
              orderOptionPrice: this.menuDetail.options[i].optionValues[j].price,
              orderMenuId: '',
              orderMenuOptionId: this.menuDetail.options[i].optionValues[j].optionId,
              menuOptionValueId: this.menuDetail.options[i].optionValues[j].optionValueId,
              quantity: 1
            };
            item.extras.push(extra);
            if (Number(j) < this.menuDetail.options[i].optionValues.length - 1) {
              item.extrasTitle += ', ';
            }
          }
        });
      });
      this.menuService.order.items.push(item);
      await this.storage.set(environment.storage.order, this.menuService.order);
      await this.back();
    }
  }

  async back() {
    await this.navController.pop();
  }
}
