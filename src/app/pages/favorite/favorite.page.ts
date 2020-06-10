import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: [ './favorite.page.scss' ],
})
export class FavoritePage implements OnInit {
  backGroundColor = environment.baseColors.burningOrage;
  menuBlankImage = environment.menuBlankImage;
  favorites = [];
  isDeleting = false;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private menuService: MenuService,
    private navController: NavController,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log();
  }

  async ionViewWillEnter() {
    await this.commonService.activeIcon(1);
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.menuService.getFavorite({ user: this.authService.user }).subscribe((res: any) => {
        this.favorites = [];
        const favorites = this.commonService.keysToCamel(res);
        // tslint:disable-next-line:forin
        for (const item in favorites) {
          this.favorites.push(favorites[item]);
        }
        loading.dismiss();
      });
    } catch (e) {
      console.log(e);
      await loading.dismiss();
      this.navController.pop();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  ionViewWillLeave() {
    this.favorites = [];
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
      this.menuService.addFavorite(payload).subscribe((res: boolean) => {
        this.isDeleting = false;
        if ( ! res) {
          favorite.isFavorite = false;
        }
        loading.dismiss();
      });
    } catch (e) {
      this.isDeleting = false;
      console.log(e);
      await loading.dismiss();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  goDetail(favorite) {
    if (this.isDeleting === true) {
      return;
    }
    this.router.navigate([ 'menu-detail/' + favorite.menuId ]);
  }
}
