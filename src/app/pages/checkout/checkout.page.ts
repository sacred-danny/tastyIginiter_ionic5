import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { environment } from '../../../environments/environment';
import { CheckOutTime } from '../../core/models/menu';
import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { keysToUnderScore } from '../../core/utils/dto.util';

import { ElementsOptions } from 'ngx-stripe';
declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: [ './checkout.page.scss' ],
})
export class CheckoutPage implements OnInit {

  @ViewChild('main') mainDiv;

  backGroundColor = environment.baseColors.burningOrange;
  isSelected = 'delivery';
  pickupTimes: Array<CheckOutTime>;
  deliveryTimes: Array<CheckOutTime>;
  savedCards: any;
  serverConfig = environment;
  isDeleting = false;
  comment = '';

  stripe = Stripe(environment.stripeApiKey);
  card: any;
  clientSecret: string;
  paymentMethodId = '';

  pickupTime = {
    id: 0,
    displayDate: '',
    displayOrderTime: '',
    date: '',
    orderTime: ''
  };

  deliveryTime = {
    id: 0,
    displayDate: '',
    displayOrderTime: '',
    date: '',
    orderTime: ''
  };

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService,
    private menuService: MenuService,
    private navController: NavController,
    private storage: Storage,
    private platform: Platform
  ) {
  }

  setTime(time, times, index) {
    time.id = times[index].id;
    time.date = times[index].date;
    time.orderTime = times[index].times[0].orderTime;
    time.displayDate = times[index].weekDay + ' - ' + times[index].day;
    time.displayOrderTime = times[index].times[0].showTime;
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const checkOutTime = await this.menuService.getCheckOutTime({ user: this.authService.user }).toPromise();
      this.deliveryTimes = checkOutTime.delivery;
      this.pickupTimes = checkOutTime.pickup;
      this.clientSecret = checkOutTime.clientSecret;
      this.savedCards = checkOutTime.savedCards;
      Object.keys(this.savedCards.data).forEach(i => {
        this.savedCards.data[i] = { ...this.savedCards.data[i], isChecked: false };
        if (Number(i) === 0) {
          this.savedCards.data[i].isChecked = true;
          this.paymentMethodId = this.savedCards.data[i].id;
        }
      });
      this.setTime(this.deliveryTime, this.deliveryTimes, 0);
      this.setTime(this.pickupTime, this.pickupTimes, 0);
      await this.setupStripe();
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

  deliveryDateChanged() {
    Object.keys(this.deliveryTimes).forEach(i => {
      if (this.deliveryTime.displayDate === this.deliveryTimes[i].weekDay + ' - ' + this.deliveryTimes[i].day) {
        this.setTime(this.deliveryTime, this.deliveryTimes, i);
      }
    });
  }

  pickupDateChanged() {
    Object.keys(this.pickupTimes).forEach(i => {
      if (this.pickupTime.displayDate === this.pickupTimes[i].weekDay + ' - ' + this.pickupTimes[i].day) {
        this.setTime(this.pickupTime, this.pickupTimes, i);
      }
    });
  }

  selectCard(item) {
    if (this.isDeleting === true) {
      return;
    }
    Object.keys(this.savedCards.data).forEach(i => {
      if (this.savedCards.data[i].id !== item.id) {
        this.savedCards.data[i].isChecked = false;
      }
    });
    item.isChecked = ! item.isChecked;
    if (item.isChecked) {
      this.paymentMethodId = item.id;
    } else {
      this.paymentMethodId = '';
    }
  }

  deliveryTimeChanged() {
    this.deliveryTime.orderTime = this.deliveryTime.displayOrderTime.split('-')[0] + ':00';
  }


  pickupTimeChanged() {
    this.pickupTime.orderTime = this.pickupTime.displayOrderTime.split('-')[0] + ':00';
  }

  async setupStripe() {
    const stripeElementStyles = environment.stripeElementStyles;
    if (this.platform.is('ios') || this.platform.is('android')) {
      stripeElementStyles.style.base.fontSize = '16px';
    }
    const elementsOptions: ElementsOptions = {
      locale: 'en'
    };
    this.card = await this.stripe.elements(elementsOptions).create('card', stripeElementStyles);
    await this.card.mount('#cardElement');
    this.card.on('ready', async () => {
      await this.card.focus();
      await setTimeout(async () => {
        await this.mainDiv.nativeElement.scrollTo(0, 0);
      }, 100);
    });
    this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  async saveCard() {
    if (this.card._empty || document.getElementById('card-errors').textContent !== '') {
      await this.commonService.presentAlert('Warning', 'Please enter correct card Info.');
      return false;
    }
    this.paymentMethodId = '';
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const result = await this.stripe.confirmCardSetup(
        this.clientSecret,
        {
          payment_method: {
            card: this.card,
          },
        }
      );
      if (result.error) {
        // Display error.message in your UI.
        await this.commonService.presentAlert('Warning', result.error.message);
        return false;
      } else {
        this.savedCards = await this.menuService.getSavedCard({ user: this.authService.user }).toPromise();
        Object.keys(this.savedCards.data).forEach(i => {
          this.savedCards.data[i] = { ...this.savedCards.data[i], isChecked: false };
          if (Number(i) === 0) {
            this.savedCards.data[i].isChecked = true;
            this.paymentMethodId = this.savedCards.data[i].id;
          }
        });
        this.card.clear();
        return this.paymentMethodId !== '';
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

  async deleteCard(item) {
    this.isDeleting = true;
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const savedCards = await this.menuService.deleteCard({ user: this.authService.user, paymentMethodId: item.id }).toPromise();
      this.savedCards = JSON.parse(JSON.stringify(savedCards));
      Object.keys(this.savedCards.data).forEach(i => {
        this.savedCards.data[i] = { ...this.savedCards.data[i], isChecked: false };
        if (Number(i) === 0) {
          this.savedCards.data[i].isChecked = true;
          this.paymentMethodId = this.savedCards.data[i].id;
        }
      });
      if (this.savedCards.data.length === 0) {
        this.paymentMethodId = '';
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

  delivery() {
    this.isSelected = 'delivery';
  }

  pickup() {
    this.isSelected = 'collection';
  }

  async verifyPayment() {
    let payload = {
      customerId: this.authService.user.id,
      totalItems: this.menuService.order.totalCount,
      comment: this.comment,
      payment: 'stripe',
      orderType: this.isSelected,
      orderTotal: this.menuService.order.currentPrice,
      statusId: 1,
      order: this.menuService.order
    };
    if (this.isSelected === 'delivery') {
      // @ts-ignore
      payload = { ...payload, orderTime: this.deliveryTime.orderTime, orderDate: this.deliveryTime.date };
    } else {
      // @ts-ignore
      payload = { ...payload, orderTime: this.pickupTime.orderTime, orderDate: this.pickupTime.date };
    }
    payload = keysToUnderScore(payload);
    try {
      const result = await this.menuService.verifyPayment(payload).toPromise();
      if (result) {
        this.menuService.order = {
          totalCount: 0,
          delivery: 0,
          currentPrice: 0,
          totalPrice: 0,
          items: [],
        };
        await this.storage.set(environment.storage.order, this.menuService.order);
        this.commonService.activeIcon(2);
        await this.router.navigateByUrl('tabs/order');
      } else {
        await this.commonService.presentAlert('Warning', 'Make order failed.');
      }
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
    }
  }

  async pay() {
    if (this.card._empty && this.paymentMethodId !== '') {
      console.log('Payment Method is already selected');
    } else {
      const saveCardResult = await this.saveCard();
      if ( ! saveCardResult) {
        return;
      }
    }
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const paymentIntent = await this.menuService.makePaymentIntent({
        user: this.authService.user,
        paymentMethodId: this.paymentMethodId,
        amount: Math.round(this.menuService.order.currentPrice * 100)
      }).toPromise();
      if (paymentIntent == null) {
        await this.verifyPayment();
      } else {
        const result = await this.stripe.confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: paymentIntent.last_payment_error.payment_method.id
          }
        );
        if (result.error) {
          // Show error to your customer
          await this.commonService.presentAlert('Warning', result.error.message);
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            await this.verifyPayment();
          }
        }
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

}
