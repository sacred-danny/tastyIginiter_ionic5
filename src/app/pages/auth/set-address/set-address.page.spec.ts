import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetAddressPage } from './set-address.page';

describe('SetLocationPage', () => {
  let component: SetAddressPage;
  let fixture: ComponentFixture<SetAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAddressPage ],
      imports: [ IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(SetAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
