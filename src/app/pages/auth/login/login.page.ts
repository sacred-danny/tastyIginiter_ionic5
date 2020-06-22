import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest, LoginResponse, SignUpRequest } from '../../../core/models/auth';
import { environment } from '../../../../environments/environment';
import { emailIsValid } from '../../../core/utils/dto.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [ './login.page.scss' ],
})
export class LoginPage implements OnInit {

  form: FormGroup = this.formBuilder.group({
    email: [ '', Validators.compose([ Validators.required, Validators.email ]) ],
    password: [ '', Validators.compose([ Validators.required, Validators.minLength(8) ]) ],
  });
  serverConfig = environment;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private fb: Facebook,
  ) {
  }

  ngOnInit() {
  }

  async signin() {
    if (this.form.value.email === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your e-mail address.');
      return;
    } else if ( ! emailIsValid(this.form.value.email)) {
      await this.commonService.presentAlert('Warning', 'You have entered an invalid e-mail address. Please try again.');
      return;
    } else if (this.form.value.password === '') {
      await this.commonService.presentAlert('Warning', 'Please set a password.');
      return;
    } else if (this.form.value.password.length < 8) {
      await this.commonService.presentAlert('Warning', 'Password must be at least 8 characters.');
      return;
    }

    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: LoginRequest = this.form.value;
      await this.authService.signin(payload);
      await this.router.navigate([ '' ], { replaceUrl: true });
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', e.error.message);
      }
    } finally {
      await loading.dismiss();
    }
  }

  async loginWithFaceBook() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const res = await this.fb.login([ 'public_profile', 'user_friends', 'email' ]);
      if (res.status === 'connected') {
        const user = await this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name,picture', [ 'public_profile' ]);
        const payload: SignUpRequest = {
          firstName: (user.name.split(' ').length[0] > 1) ? user.name.split(' ')[0] : user.name,
          lastName: (user.name.split(' ').length[0] > 1) ? user.name.split(' ')[1] : '',
          telephone: '',
          email: user.email,
          password: '',
          isFacebook: true,
        };
        const result: LoginResponse = await this.authService.signup(payload);
        if (result.user.deliveryAddress === '') {
          await this.router.navigate([ '/set-location' ]);
        } else {
          await this.router.navigate([ '' ], { replaceUrl: true });
        }
      } else {
        await this.commonService.presentAlert('Warning', 'Error logging into Facebook');
      }
    } catch (e) {
      if (e.status === 500) {
        await this.commonService.presentAlert('Warning', 'Internal Server Error');
      } else {
        await this.commonService.presentAlert('Warning', 'Error logging into Facebook');
      }
    } finally {
      await loading.dismiss();
    }
  }

}
