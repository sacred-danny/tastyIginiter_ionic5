import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxMaskModule } from 'ngx-mask';

import { TextInputComponent } from './text-input/text-input.component';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input.component';


@NgModule({
  declarations: [
    TextInputComponent,
    PhoneNumberInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    TextInputComponent,
    PhoneNumberInputComponent
  ]
})
export class InputModule {
}
