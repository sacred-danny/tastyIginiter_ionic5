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

  ngOnInit() {
    this.commonService.activeIcon(3);
  }

  profileEdit() {
    if (this.authService.user.isFacebook) {
      this.commonService.presentAlert('Warning', 'Facebook user is not available to edit.');
      return;
    }
    this.router.navigate([ '/signup' ]);
  }

  goDetail(item) {
    switch (item.title) {
      case 'Delivery Support':
        this.router.navigate([ '/set-location' ]);
        break;
      case 'Terms of use':
        this.router.navigate([ '/terms' ]);
        break;
      case 'Privacy policy':
        this.router.navigate([ '/policy' ]);
        break;
    }
  }

  goSetLocation() {
    this.router.navigate([ '/set-location' ]);
  }
}
