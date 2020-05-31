import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeJavascriptPageRoutingModule } from './stripe-javascript-routing.module';

import { StripeJavascriptPage } from './stripe-javascript.page';
import { NgxStripeModule } from 'ngx-stripe';
import { config } from '../../config/config';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripeJavascriptPageRoutingModule,
    NgxStripeModule.forRoot(config.stripeApiKey),
    ReactiveFormsModule
  ],
  declarations: [ StripeJavascriptPage ]
})
export class StripeJavascriptPageModule {
}
