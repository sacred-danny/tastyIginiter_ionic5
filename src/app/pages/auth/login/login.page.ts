import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../../core/services/common.service';
import { AuthService } from '../../../core/services/auth.service';

import { LoginRequest } from '../../../core/models/auth';
import { config } from '../../../config/config';


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

  backGroundColor = config.baseColors.burningOrage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  async signin() {
    const loading = await this.commonService.showLoading('Please wait...');
    try {
      const payload: LoginRequest = this.form.value;
      await this.authService.signin(payload);
      await this.router.navigate(['/set-location'], {replaceUrl: true});
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
