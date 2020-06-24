import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderHeaderComponent } from './order-header.component';

describe('OrderHeaderComponent', () => {
  let component: OrderHeaderComponent;
  let fixture: ComponentFixture<OrderHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHeaderComponent ],
      imports: [ IonicModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
