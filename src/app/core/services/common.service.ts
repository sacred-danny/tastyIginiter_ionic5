import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  navBarActivateIcons = [ false, false, false, false ];
  isInit = false;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      duration: 2000,
      message
    });
    await toast.present();
  }

  async presentAlert(warning, msg) {
    const alert = await this.alertController.create({
      header: warning,
      message: msg,
      buttons: [ 'OK' ]
    });
    await alert.present();
  }

  async presentCallPhoneAlert() {
    const alert = await this.alertController.create({
      message: environment.supportPhoneNumber,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Call',
          handler: async () => {
            document.getElementById('telephone').click();
          }
        }
      ]
    });
    await alert.present();
  }

  activeIcon(index) {
    Object.keys(this.navBarActivateIcons).forEach(i => {
      this.navBarActivateIcons[i] = (Number(i) === index);
    });
  }

}
