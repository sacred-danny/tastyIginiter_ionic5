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
  profileItems = [
    {
      icon: 'help-circle',
      title: 'Delivery Support',
      url: '',
      color: '#f1374c'
    },
    {
      icon: 'settings',
      title: 'Push Notifications',
      url: '',
      color: '#3f93fa'
    },
    {
      icon: 'alert-circle',
      title: 'Terms of use',
      url: '',
      color: '#6fe1a5'
    },
    {
      icon: 'lock-closed',
      title: 'Privacy policy',
      url: '',
      color: '#fc8c12'
    }
  ];

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  async ngOnInit() {
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
        await this.router.navigate([ '/set-location' ]);
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

}
