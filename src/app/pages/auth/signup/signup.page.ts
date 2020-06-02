import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { SignUpRequest } from '../../../core/models/auth';
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

  serverConfig = config;
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
    if (this.form.value.firstName === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your first name.');
      return;
    } else if (this.form.value.lastName === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your last name.');
      return;
    } else if (this.form.value.telephone === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your phone number.');
      return;
    } else if (this.form.value.telephone.length < 11 ) {
      await this.commonService.presentAlert('Warning', 'Phone number must must be 11 numerics.');
      return;
    } else if (this.form.value.email === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your e-mail address.');
      return;
    } else if (!this.commonService.emailIsValid(this.form.value.email)) {
      await this.commonService.presentAlert('Warning', 'You have entered an invalid e-mail address. Please try again.');
      return;
    } else if (this.form.value.password === '') {
      await this.commonService.presentAlert('Warning', 'Please set a password.');
      return;
    } else if (this.form.value.password.length < 8) {
      await this.commonService.presentAlert('Warning', 'Password must be at least 8 characters.');
      return;
    } else if (this.form.value.password !== this.form.value.confirmPassword) {
      await this.commonService.presentAlert('Warning', 'The passwords you entered do not match. Please re-enter your password.');
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
        await this.commonService.presentAlert('Warning', 'Internal Server Error.');
        return;
      }
      await this.commonService.presentAlert('Warning', e.error.message);
    } finally {
      await loading.dismiss();
    }
  }
}
