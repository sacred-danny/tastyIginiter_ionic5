import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { isArray, isObject } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  navBarActivateIcons = [false, false, false, false];

  constructor(
    private toastController: ToastController,
    private alertContoller: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  async showToast(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      duration: 2000,
      message
    });
    await toast.present();
  }

  async presentAlert(warning, msg) {
    const alert = await this.alertContoller.create({
      header: warning,
      message: msg,
      buttons: [ 'OK' ]
    });
    await alert.present();
  }

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toCamel(s) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  toUnderScore(s) {
    return s.replace(/(?:^|\.?)([A-Z])/g, (x, y) => {
      return '_' + y.toLowerCase();
    }).replace(/^_/, '');
  }

  keysToCamel(o: any) {
    if (isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[this.toCamel(k)] = this.keysToCamel(o[k]);
        });
      return n;
    } else if (isArray(o)) {
      return o.map((i) => {
        return this.keysToCamel(i);
      });
    }
    return o;
  }

  keysToUnderScore(o: any) {
    if (isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[this.toUnderScore(k)] = this.keysToUnderScore(o[k]);
        });
      return n;
    } else if (isArray(o)) {
      return o.map((i) => {
        return this.keysToUnderScore(i);
      });
    }
    return o;
  }

  activeIcon(index) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0 ; i < this.navBarActivateIcons.length; i++) {
      this.navBarActivateIcons[i] = false;
      if (i === index) {
        this.navBarActivateIcons[i] = true;
      }
    }
  }
}
