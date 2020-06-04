import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonKitModule } from '../../../ui-kit/common-kit/common-kit.module';
import { IonicModule } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';

import { InputModule } from '../../../ui-kit/input/input.module';
import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CommonKitModule,
    InputModule,
  ],
  declarations: [ LoginPage ],
  providers: [
    // Facebook,
  ]
})
export class LoginPageModule {
}
