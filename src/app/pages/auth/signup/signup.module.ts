import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommonKitModule } from '../../../ui-kit/common-kit/common-kit.module';
import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { InputModule } from '../../../ui-kit/input/input.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CommonKitModule,
    SignupPageRoutingModule,
    InputModule
  ],
  declarations: [ SignupPage ]
})
export class SignupPageModule {
}
