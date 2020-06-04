import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth';
import { environment } from '../../../../environments/environment';

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
    // private fb: Facebook
  ) {
  }

  ngOnInit() {
  }

  async signin() {
    if (this.form.value.email === '') {
      await this.commonService.presentAlert('Warning', 'Please enter your e-mail address.');
      return;
    } else if ( ! this.commonService.emailIsValid(this.form.value.email)) {
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

  loginWithFaceBook() {
    // this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
    //   .then( (res: FacebookLoginResponse) => {
    //     if (res.status === 'connected') {
    //       // Get user ID and Token
    //       const fbId = res.authResponse.userID;
    //       const fbToken = res.authResponse.accessToken;
    //       // Get user infos from the API
    //       this.fb.api('/me?fields=name,gender,birthday,email', []).then((user) => {
    //         // Get the connected user details
    //         const gender    = user.gender;
    //         const birthday  = user.birthday;
    //         const name      = user.name;
    //         const email     = user.email;
    //         // => Open user session and redirect to the next page
    //       });
    //     } else {
    //       console.log('An error occurred...');
    //     }
    //   })
    //   .catch((e) => {
    //     console.log('Error logging into Facebook', e);
    //   });
  }
}
