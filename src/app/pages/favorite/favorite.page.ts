import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { environment } from '../../../environments/environment';
import { associateArrayToArray, keysToCamel } from '../../core/utils/dto.util';
import { MenuDetail } from '../../core/models/menu';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: [ './favorite.page.scss' ],
})
export class FavoritePage implements OnInit {

  backGroundColor = environment.baseColors.burningOrange;
  menuBlankImage = environment.menuBlankImage;
  favorites: Array<MenuDetail> = [];
  isLoading = true;
  isDeleting = false;

  constructor(
    public commonService: CommonService,
    public authService: AuthService,
    public menuService: MenuService,
    public navController: NavController,
    public router: Router
  ) {
  }

  async ngOnInit() {
    if (this.commonService.isInit) {
      await this.ionViewWillEnter();
    }
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    this.commonService.activeIcon(1);
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const res = await this.menuService.getFavorite({ user: this.authService.user }).toPromise();
      this.favorites = associateArrayToArray(keysToCamel(res));
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async removeFavorite(favorite: any) {
    if (this.isDeleting) {
      return;
    }
    this.isDeleting = true;
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload = {
        id: favorite.menuId,
        userId: this.authService.user.id
      };
      const res = await this.menuService.addFavorite(payload).toPromise();
      if ( ! res) {
        favorite.isFavorite = false;
      }
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
      this.isDeleting = false;
    }
  }

  async goDetail(favorite) {
    if (this.isDeleting === true) {
      return;
    }
    await this.router.navigate([ 'menu-detail/' + favorite.menuId ]);
  }

}
