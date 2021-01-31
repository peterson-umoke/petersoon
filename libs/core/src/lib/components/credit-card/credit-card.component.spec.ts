import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { CreditCardDirective } from '../../directives/credit-card/credit-card.directive';
import { Environment } from '../../models';
import { MaterialModule } from '../../modules';
import { PaymentService, SnackBarService, UserService } from '../../services';
import { CreditCardComponent } from './credit-card.component';

describe('CreditCardComponent', () => {
  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [CreditCardComponent, MockDirective(CreditCardDirective)],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            addCard: () => Promise.resolve(),
          },
        },
        {
          provide: UserService,
          useValue: {
            $selectedOrgBillable: new BehaviorSubject(null).asObservable(),
            organizationInfo: {},
            $profile: of({ user: { is_superuser: false } }),
          },
        },
        { provide: Environment, useValue: {} },
        { provide: SnackBarService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardComponent);
    component = fixture.componentInstance;
    window['Spreedly'] = {
      init: () => {},
      on: () => {},
      removeHandlers: () => {},
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept valid postal codes', () => {
    component.cardForm.controls.postalCode.setValue('8400');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      true
    );

    component.cardForm.controls.postalCode.setValue('84004');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.postalCode.setValue('84004-123');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      true
    );

    component.cardForm.controls.postalCode.setValue('84004-1234');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.postalCode.setValue('D0A 2F0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      true
    );

    component.cardForm.controls.postalCode.setValue('G0E 1V0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.postalCode.setValue('W0E 1V0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      true
    );

    component.cardForm.controls.postalCode.setValue('K0A2X0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.postalCode.setValue('k0a2x0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.postalCode.setValue('K0A-2X0');
    expect(component.cardForm.controls.postalCode.hasError('pattern')).toBe(
      false
    );
  });

  it('should accept valid expiration dates', () => {
    component.cardForm.controls.expiration.setValue('02/2022');
    expect(component.cardForm.controls.expiration.hasError('pattern')).toBe(
      false
    );

    component.cardForm.controls.expiration.setValue('02/22');
    expect(component.cardForm.controls.expiration.hasError('pattern')).toBe(
      true
    );
  });

  it('should have a valid form if required fields are valid', () => {
    component.cardForm.controls.name.setValue('Bilbo Baggins');
    expect(component.cardForm.valid).toBe(false);
    component.cardForm.controls.expiration.setValue('02/2022');
    expect(component.cardForm.valid).toBe(false);
    component.cardForm.controls.address1.setValue('Bag End');
    expect(component.cardForm.valid).toBe(false);
    component.cardForm.controls.city.setValue('Hobbiton');
    expect(component.cardForm.valid).toBe(false);
    component.cardForm.controls.state.setValue('The Shire');
    expect(component.cardForm.valid).toBe(false);
    component.cardForm.controls.postalCode.setValue('84004');
    expect(component.cardForm.valid).toBe(true);
  });
});
