import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private toastController: ToastController,
    private alertContoller: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {
  }

  printLog(title, text) {
    if (environment.enableLog) {
      console.log(title + ':', text);
    }
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
}
