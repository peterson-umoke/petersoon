import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import {
  CurrencyService,
  MaterialModule,
  PaymentDetailsComponent,
  PaymentService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { AddCreditDialogComponent } from '../add-credit-dialog/add-credit-dialog.component';
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [
        PaymentsComponent,
        MockComponents(AddCreditDialogComponent, PaymentDetailsComponent),
      ],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            addPayment: () => Promise.resolve({}),
            chargeCard: () => Promise.resolve({}),
            getAllPayments: () => Promise.resolve([]),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ close: _.noop, afterClosed: () => of('') }),
          },
        },
        {
          provide: CurrencyService,
          useValue: {
            toNumber: (value) => parseFloat(value),
          },
        },
        {
          provide: UserService,
          useValue: {
            $selectedOrgInfo: EMPTY,
            $profile: of({ user: { is_superuser: false } }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Add Credit Button', () => {
    const createOrgInfo = (permissions: Array<string>) => {
      const userService = <any>TestBed.inject(UserService);
      userService.organizationInfo = { permissions: permissions };
      userService.$selectedOrganization = new BehaviorSubject({});
      userService.$selectedOrgInfo = of({ permissions });
      component.ngOnInit();
    };

    const initializePayments = (hours: Array<number>) => {
      return _.map(hours, (hour) => {
        const payment = new Date();
        payment.setHours(payment.getHours() - hour);
        return { created: payment.toISOString() };
      });
    };

    it('should not show button', () => {
      createOrgInfo([]);
      expect(component.canAddCredit).toBeFalsy();
    });

    it('should show button', () => {
      createOrgInfo(['create_payment']);
      expect(component.canAddCredit).toBeTruthy();
    });

    it('should show AddCreditDialogComponent on add credit button click', async () => {
      createOrgInfo(['create_payment']);
      fixture.detectChanges();
      await fixture.whenStable();

      const dialog = TestBed.inject(MatDialog);
      const dia = dialog.open(AddCreditDialogComponent);
      dia.afterClosed = () =>
        new BehaviorSubject({
          amount: '12.34',
          details: 'Details',
          type: 'type',
        });

      spyOn(dialog, 'open').and.returnValue(dia);
      const addPayment = spyOn(TestBed.inject(PaymentService), 'addPayment');
      fixture.debugElement
        .query(By.css('button[data-test=add-credit-button]'))
        .nativeElement.click();
      expect(dialog.open).toHaveBeenCalled();
      dia.close();
      expect(addPayment).toHaveBeenCalledWith({
        amount: 12.34,
        details: { notes: 'Details' },
        type: 'type',
      });
    });

    it('canAddPayment should be enabled for less than 2 payments within 24 hours', async () => {
      const getAllPayments = spyOn(
        TestBed.inject(PaymentService),
        'getAllPayments'
      ).and.returnValue(Promise.resolve(<any>initializePayments([2, 72, 100])));
      const userService = <any>TestBed.inject(UserService);
      userService.$profile = new BehaviorSubject({
        user: { is_superuser: false },
      });

      createOrgInfo(['create_payment']);

      expect(component.canAddPayment).toBe(true);
    });

    it('canAddPayment should be disabled for 2 payments within 24 hours', async () => {
      const getAllPayments = spyOn(
        TestBed.inject(PaymentService),
        'getAllPayments'
      ).and.returnValue(Promise.resolve(<any>initializePayments([2, 23])));
      const userService = <any>TestBed.inject(UserService);
      userService.$profile = new BehaviorSubject({
        user: { is_superuser: false },
      });

      createOrgInfo(['create_payment']);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.canAddPayment).toBe(false);
    });

    it('canAddPayment should be enabled for super user', async () => {
      const getAllPayments = spyOn(
        TestBed.inject(PaymentService),
        'getAllPayments'
      ).and.returnValue(Promise.resolve(<any>initializePayments([2, 23])));
      const userService = <any>TestBed.inject(UserService);
      userService.$profile = new BehaviorSubject({
        user: { is_superuser: true },
      });

      createOrgInfo(['create_payment']);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(getAllPayments).toHaveBeenCalled();
      expect(component.canAddPayment).toBe(true);
    });
  });
});
