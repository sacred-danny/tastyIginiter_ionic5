import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { SignUpRequest } from '../../../core/models/auth';
import { environment } from '../../../../environments/environment.prod';
import { emailIsValid } from '../../../core/utils/dto.util';

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

  user = {
    userId: '',
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  title = 'Sign up';

  serverConfig = environment;
  backGroundColor = environment.baseColors.pistachio;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public commonService: CommonService,
    public router: Router,
  ) {
  }

  ngOnInit() {
    if (this.authService.user) {
      this.title = 'Edit Profile';
      this.user.userId = this.authService.user.id;
      this.user.firstName = this.authService.user.firstName;
      this.user.lastName = this.authService.user.lastName;
      this.user.telephone = this.authService.user.telephone;
      this.user.email = this.authService.user.email;
    }
  }

  async signup() {
    if (this.user.firstName === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your first name.');
      return;
    } else if (this.user.lastName === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your last name.');
      return;
    } else if (this.user.telephone === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your phone number.');
      return;
    } else if (this.user.telephone.length < 11) {
      await this.commonService.presentAlert('Warning', 'Phone number must must be 11 numerics.');
      return;
    } else if (this.user.email === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your e-mail address.');
      return;
    } else if ( ! emailIsValid(this.user.email)) {
      await this.commonService.presentAlert('Warning', 'You have entered an invalid e-mail address. Please try again.');
      return;
    } else if (this.user.password === '') {
      await this.commonService.presentAlert('Warning', 'Please set a password.');
      return;
    } else if (this.user.password.length < 8) {
      await this.commonService.presentAlert('Warning', 'Password must be at least 8 characters.');
      return;
    } else if (this.user.password !== this.user.confirmPassword) {
      await this.commonService.presentAlert('Warning', 'The passwords you entered do not match. Please re-enter your password.');
      return;
    }

    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: SignUpRequest = {
        userId: this.user.userId,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        telephone: this.user.telephone,
        email: this.user.email,
        password: this.user.password
      };
      await this.authService.signup(payload);
      if (this.user.userId === '') {
        await this.router.navigate([ '/set-address' ], { replaceUrl: true });
        await this.commonService.showToast('Thanks for Signing Up.');
      } else {
        await this.router.navigate([ '' ], { replaceUrl: true });
      }
    } catch (e) {
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
