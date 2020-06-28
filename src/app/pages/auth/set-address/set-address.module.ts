import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetAddressPageRoutingModule } from './set-address-routing.module';

import { SetAddressPage } from './set-address.page';
import { InputModule } from '../../../ui-kit/input/input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InputModule,
    SetAddressPageRoutingModule
  ],
  declarations: [ SetAddressPage ]
})
export class SetAddressPageModule {
}
