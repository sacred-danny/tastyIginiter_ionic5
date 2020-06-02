import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { config } from '../../config/config';
import { CheckOutTime } from '../../core/models/menu';
import { CommonService } from '../../core/services/common.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: [ './checkout.page.scss' ],
})
export class CheckoutPage implements OnInit {
  backGroundColor = config.baseColors.burningOrage;
  isSelected = 'delivery';
  pickupTimes: Array<CheckOutTime>;
  deliveryTimes: Array<CheckOutTime>;
  savedCards: any;
  serverConfig = config;

  stripe = Stripe(config.stripeApiKey);
  card: any;
  clientSecret: string;
  paymentMethodId = '';

  isNewCard = false;

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

  comment = '';

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService,
    private menuService: MenuService,
    private navController: NavController,
  ) {
  }

  setTime(deliveryIndex = null, pickupIndex = null) {
    if (deliveryIndex != null) {
      this.deliveryTime.id = this.deliveryTimes[deliveryIndex].id;
      this.deliveryTime.date = this.deliveryTimes[deliveryIndex].date;
      this.deliveryTime.orderTime = this.deliveryTimes[deliveryIndex].times[0].orderTime;
      this.deliveryTime.displayDate = this.deliveryTimes[deliveryIndex].weekDay + ' - ' + this.deliveryTimes[deliveryIndex].day;
      this.deliveryTime.displayOrderTime = this.deliveryTimes[deliveryIndex].times[0].showTime;
    }
    if (pickupIndex != null) {
      this.pickupTime.id = this.pickupTimes[pickupIndex].id;
      this.pickupTime.date = this.pickupTimes[pickupIndex].date;
      this.pickupTime.orderTime = this.pickupTimes[pickupIndex].times[0].orderTime;
      this.pickupTime.displayDate = this.pickupTimes[pickupIndex].weekDay + ' - ' + this.pickupTimes[pickupIndex].day;
      this.pickupTime.displayOrderTime = this.pickupTimes[pickupIndex].times[0].showTime;
    }
  }

  async ngOnInit() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      this.menuService.getCheckOutTime({user: this.authService.user}).subscribe((checkOutTime: any) => {
        this.deliveryTimes = checkOutTime.delivery;
        this.pickupTimes = checkOutTime.pickup;
        this.clientSecret = checkOutTime.clientSecret;
        this.savedCards = checkOutTime.savedCards;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.savedCards.data.length; i++) {
          this.savedCards.data[i] = {...this.savedCards.data[i], isChecked: false};
        }
        this.setTime(0, 0);
        this.setupStripe();
        loading.dismiss();
      });
    } catch (e) {
      loading.dismiss();
      this.navController.pop();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  deliveryDateChanged() {
    for (let i = 0; i < this.deliveryTimes.length; i++) {
      if (this.deliveryTime.displayDate === this.deliveryTimes[i].weekDay + ' - ' + this.deliveryTimes[i].day) {
        this.setTime(i);
        break;
      }
    }
  }

  selectCard(item) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0;  i < this.savedCards.data.length; i++) {
      if (this.savedCards.data[i].id !== item.id) {
        this.savedCards.data[i].isChecked = false;
      }
    }
    item.isChecked = !item.isChecked;
    if (item.isChecked) {
      this.paymentMethodId = item.id;
    } else {
      this.paymentMethodId = '';
    }
  }

  deliveryTimeChanged() {
    this.deliveryTime.orderTime = this.deliveryTime.displayOrderTime.split('-')[0] + ':00';
  }

  pickupDateChanged() {
    for (let i = 0; i < this.pickupTimes.length; i++) {
      if (this.pickupTime.displayDate === this.pickupTimes[i].weekDay + ' - ' + this.pickupTimes[i].day) {
        this.setTime(null, i);
        break;
      }
    }
  }

  pickupTimeChanged() {
    this.pickupTime.orderTime = this.pickupTime.displayOrderTime.split('-')[0] + ':00';
  }

  checkout() {
    this.router.navigateByUrl('stripe-javascript');
  }

  async setupStripe() {
    const elements = await this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '13px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = await elements.create('card', { style });

    await this.card.mount('#card-element');

    await this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  async saveCard() {
    const loading = await this.commonService.showLoading('Please wait...');
    const self = this;
    try {
      self.stripe.confirmCardSetup(
        self.clientSecret,
        {
          payment_method: {
            card: self.card,
          },
        }
      ).then(async (result) => {
        self.isNewCard = false;
        if (result.error) {
          // Display error.message in your UI.
          loading.dismiss();
          this.commonService.presentAlert('Warning', result.error.message);
          return;
        } else {
          // The setup has succeeded. Display a success message.
          console.log(result);
          try {
            const savedCards = await self.menuService.getSavedCard({user: this.authService.user}).toPromise();
            self.savedCards = JSON.parse(JSON.stringify(savedCards));
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < self.savedCards.data.length; i++) {
              self.savedCards.data[i] = {...self.savedCards.data[i], isChecked: false};
            }
            loading.dismiss();
          } catch (e) {
            loading.dismiss();
            if (e.status === 500) {
              await this.commonService.presentAlert('Warning', 'Internal Server Error');
              return;
            }
            await this.commonService.presentAlert('Warning', e.error.message);
          }
        }
      });
    } catch (e) {
      loading.dismiss();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  async deleteCard(item) {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const savedCards = await this.menuService.deleteCard({user: this.authService.user, paymentMethodId: item.id}).toPromise();
      this.savedCards = JSON.parse(JSON.stringify(savedCards));
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.savedCards.data.length; i++) {
        this.savedCards.data[i] = {...this.savedCards.data[i], isChecked: false};
      }
      loading.dismiss();
    } catch (e) {
      loading.dismiss();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  addCard() {
    if (!this.isNewCard) {
      this.isNewCard = true;
    }
  }

  delivery() {
    this.isSelected = 'delivery';
  }

  pickup() {
    this.isSelected = 'collection';
  }

  async verifyPayment(loading) {
    let payload = {
      customerId: this.authService.user.id,
      totalItems: this.menuService.order.totalCount,
      comment: this.comment,
      payment: 'stripe',
      orderType: this.isSelected,
      statusId: 1,
    };
    if (this.isSelected === 'delivery') {
      // @ts-ignore
      payload = {...payload, orderTime: this.deliveryTime.orderTime, orderDate: this.deliveryTime.date};
    } else {
      // @ts-ignore
      payload = {...payload, orderTime: this.pickupTime.orderTime, orderDate: this.pickupTime.date};
    }
    payload = this.commonService.keysToUnderScore(payload);
    // tslint:disable-next-line:no-shadowed-variable
    try {
      const result = await this.menuService.verifyPayment(payload).toPromise();
      loading.dismiss();
      if (result) {
        alert('success');
      } else {
        alert('fail');
      }
    } catch (e) {
      loading.dismiss();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }

  async pay() {
    if (this.paymentMethodId === '') {
      this.commonService.presentAlert('Warning', 'Select Payment method.');
      return;
    }
    const self = this;
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      // tslint:disable-next-line:max-line-length
      const paymentIntent = await this.menuService.makePaymentIntent({user: this.authService.user, paymentMethodId: this.paymentMethodId, amount: Math.round(this.menuService.order.currentPrice * 100)}).toPromise();
      if (paymentIntent == null) {
        self.verifyPayment(loading);
        return;
      }
      this.stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: paymentIntent.last_payment_error.payment_method.id
        }
      ).then(result => {
        if (result.error) {
          // Show error to your customer
          loading.dismiss();
          console.log(result.error.message);
          this.commonService.presentAlert('Warning', result.error.message);
          return;
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            self.verifyPayment(loading);
          }
        }
      });
    } catch (e) {
      loading.dismiss();
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    }
  }
}
