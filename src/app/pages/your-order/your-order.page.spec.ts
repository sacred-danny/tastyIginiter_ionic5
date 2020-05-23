import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourOrderPage } from './your-order.page';

describe('YourOrderPage', () => {
  let component: YourOrderPage;
  let fixture: ComponentFixture<YourOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
