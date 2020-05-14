import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { LoginRequest, SetLocationRequest, SignUpRequest } from '../../../core/models/auth';
import { config } from '../../../config/config';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [ './signup.page.scss' ],
})
export class SignupPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    firstName: [ '', Validators.compose([ Validators.required ]) ],
    lastName: [ '', Validators.compose([ Validators.required ]) ],
    telephone: [ '', Validators.compose([ Validators.required, Validators.minLength(11) ]) ],
    email: [ '', Validators.compose([ Validators.required, Validators.email ]) ],
    password: [ '', Validators.compose([ Validators.required, Validators.minLength(8) ]) ],
    confirmPassword: [ '', Validators.compose([ Validators.required, Validators.minLength(8) ]) ],
  });

  backGroundColor = config.baseColors.pistachio;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  async signup() {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.commonService.presentAlert('Warning', 'Passwrod & Confirm Password does not match.');
      return;
    }
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: SignUpRequest = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        telephone: this.form.value.telephone,
        email: this.form.value.email,
        password: this.form.value.password
      };
      await this.authService.signup(payload);
      await this.router.navigate([ '/set-location' ], { replaceUrl: true });
      await this.commonService.showToast('Thanks for Signing Up.');
    } catch (e) {
      console.log(e);
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    } finally {
      await loading.dismiss();
    }
  }
}
