import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripeJavascriptPage } from './stripe-javascript.page';

describe('StripeJavascriptPage', () => {
  let component: StripeJavascriptPage;
  let fixture: ComponentFixture<StripeJavascriptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeJavascriptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeJavascriptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
