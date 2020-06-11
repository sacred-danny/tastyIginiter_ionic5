import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
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
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private authService: AuthService,
    private commonService: CommonService,
    private navController: NavController,
    private router: Router,
    private storage: Storage
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
      Object.keys(this.menuDetail.options).forEach(key => {
        if (key === 'optionVlaues') {
          Object.keys(this.menuDetail.options[key]).forEach(subkey => {
            this.menuDetail.options[key][subkey] = {...this.menuDetail.options[key][subkey],  isChecked: false};
          });
        }
      });
      await setTimeout(() => {
        const y = document.getElementById('comment').offsetTop;
        if (y < document.body.offsetHeight - 315) {
          this.showComment = false;
        }
      }, 1);
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
    const y = document.getElementById('comment').offsetTop;
    await this.myContent.scrollToPoint(0, y, 700);
  }

  async addOrder() {
    if (this.isOrder === false) {
      this.isOrder = true;
      this.menuService.order.totalCount += this.count;
      this.menuService.order.totalPrice += this.price;
      const item: Item = {
        name: this.menuDetail.menu.menuName,
        count: this.count,
        price: this.price,
        comment: this.comment,
        photo: this.menuDetail.menu.menuImageUrl,
        extras: ''
      };
      Object.keys(this.menuDetail.options.length).forEach(i => {
        Object.keys(this.menuDetail.options[i]).forEach(j => {
          if (this.menuDetail.options[i].optionValues[j].isChecked) {
            item.extras += this.menuDetail.options[i].optionValues[j].value;
            if (Number(j) < this.menuDetail.options[i].optionValues.length - 1) {
              item.extras += ', ';
            }
          }
        });
      });
      this.menuService.order.items.push(item);
      await this.storage.set(environment.storage.order, this.menuService.order);
      await this.navController.pop();
    }
  }

  async back() {
    await this.router.navigate([ '/tabs/menu' ], { replaceUrl: true });
  }

}
