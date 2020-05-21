import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: [ './auth-header.component.scss' ],
})
export class AuthHeaderComponent implements OnInit {

  @Input() backGroundColor: string;
  @Input() backUrl: string;
  @Input() isLogo: boolean;
  @Input() isSignup: boolean;
  @Input() isSignIn: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
