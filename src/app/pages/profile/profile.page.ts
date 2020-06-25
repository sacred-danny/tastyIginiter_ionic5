import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [ './profile.page.scss' ],
})
export class ProfilePage implements OnInit {

  menuBlankImage = environment.menuBlankImage;
  isPushNotification = true;

  profileItems = [
    {
      icon: 'home',
      title: 'Address',
      message: 'Change your delivery  address',
      url: '',
      color: '#70e2a5'
    },
    {
      icon: 'help-circle',
      title: 'Delivery Support',
      message: '',
      url: '',
      color: '#f1374c'
    },
    {
      icon: 'settings',
      title: 'Push Notifications',
      message: '',
      url: '',
      color: '#3f93fa'
    },
    {
      icon: 'alert-circle',
      title: 'Terms of use',
      message: '',
      url: '',
      color: '#6fe1a5'
    },
    {
      icon: 'lock-closed',
      title: 'Privacy policy',
      message: '',
      url: '',
      color: '#fc8c12'
    }
  ];

  constructor(
    public commonService: CommonService,
    public authService: AuthService,
    public router: Router
  ) {
  }

  async ngOnInit() {
    this.isPushNotification = this.authService.user.isPush;
    if (this.commonService.isInit) {
      await this.ionViewWillEnter();
    }
  }

  ionViewWillEnter() {
    this.commonService.activeIcon(3);
  }

  async profileEdit() {
    if (this.authService.user.isFacebook) {
      await this.commonService.presentAlert('Warning', 'Facebook user is not available to edit.');
      return;
    }
    await this.router.navigate([ '/signup' ]);
  }

  async goDetail(item) {
    switch (item.title) {
      case 'Delivery Support':
        await this.commonService.presentCallPhoneAlert();
        break;
      case 'Terms of use':
        await this.router.navigate([ '/terms' ]);
        break;
      case 'Privacy policy':
        await this.router.navigate([ '/policy' ]);
        break;
    }
  }

  async goSetLocation() {
    await this.router.navigate([ '/set-location' ]);
  }

  async pushStatus() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.isPushNotification = ! this.isPushNotification;
      const payload = {
        user: this.authService.user,
        isPush: (this.isPushNotification === true) ? 1 : 0
      };
      const result = await this.authService.pushStatus(payload).toPromise();
      console.log(result);
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
}
