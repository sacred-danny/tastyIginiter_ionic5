import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';
import { emailIsValid } from '../../../core/utils/dto.util';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [ './forgot-password.page.scss' ],
})
export class ForgotPasswordPage implements OnInit {

  form: FormGroup = this.formBuilder.group({
    email: [ '', Validators.required ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private navController: NavController
  ) {
  }

  ngOnInit() {
  }

  async forgotPassword() {
    if (this.form.value.email === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your e-mail address.');
      return;
    } else if ( ! emailIsValid(this.form.value.email)) {
      await this.commonService.presentAlert('Warning', 'You have entered an invalid e-mail address. Please try again.');
      return;
    }
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload = {
        email: this.form.value.email
      };
      const result = await this.authService.forgotPassword(payload);
      if (result) {
        await this.commonService.presentAlert('Success', 'Forgot-Password mail was sent.');
        await this.navController.pop();
      } else {
        await this.commonService.presentAlert('Warning', 'Sendign Forgot-Password mail failed.');
      }
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error.');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

}
