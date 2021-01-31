import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CurrencyDirective,
  MaterialModule,
  PaymentService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { AddPaymentDialogComponent } from './add-payment-dialog.component';

describe('AddPaymentDialogComponent', () => {
  let component: AddPaymentDialogComponent;
  let fixture: ComponentFixture<AddPaymentDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [
        AddPaymentDialogComponent,
        MockDirective(CurrencyDirective),
      ],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            cards: () => Promise.resolve([]),
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
