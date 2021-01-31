import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockPipe } from 'ng-mocks';
import { Environment } from '../../models';
import { MaterialModule } from '../../modules';
import { PaymentCodeStringPipe } from '../../pipes';
import { TranslationService, UserService } from '../../services';
import { PaymentDetailsComponent } from './payment-details.component';

describe('PaymentDetailsComponent', () => {
  let component: PaymentDetailsComponent;
  let fixture: ComponentFixture<PaymentDetailsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [PaymentDetailsComponent, MockPipe(PaymentCodeStringPipe)],
      providers: [
        { provide: UserService, useValue: {} },
        { provide: TranslationService, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
