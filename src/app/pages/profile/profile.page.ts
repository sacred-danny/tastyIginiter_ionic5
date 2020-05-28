import { Component, OnInit } from '@angular/core';
import { config } from '../../config/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  menuBlankImage = config.menuBlankImage;
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

  constructor() { }

  ngOnInit() {
  }

  goDetail(item) {

  }
}
