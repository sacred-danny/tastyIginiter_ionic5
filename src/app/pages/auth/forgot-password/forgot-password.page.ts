import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  forgotPassword() {

  }
}
