import {
  AfterViewInit,
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Environment } from '../../models';
import { PaymentService, SnackBarService, UserService } from '../../services';

interface ValidationObject {
  cardType: string;
  validNumber: boolean;
  validCvv: boolean;
  numberLength: number;
  cvvLength: number;
}

const CVV_MAX = 4;
const NUMBER_FORMAT =
  '\
  width: 100%; \
  font-size: 16px; \
  font-weight: 300; \
  line-height: 1.125; \
';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements AfterViewInit, OnDestroy, OnInit {
  private subscriptions: Subscription = new Subscription();

  @Output() cardAdded = new EventEmitter();
  public cardForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    number: new FormControl(' ', [Validators.required]),
    expiration: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d{2}\/\d{4}/),
    ]),
    cvv: new FormControl(' ', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /(^\d{5}(-\d{4})?$)|(^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$)|(^\d{6}$)/i
      ), // matches US or CA postal codes
    ]),
  });
  public orgBillable = false;
  public cvvMax = CVV_MAX;

  constructor(
    private paymentService: PaymentService,
    private snackBarService: SnackBarService,
    private userService: UserService,
    private zone: NgZone,
    private environment: Environment
  ) {}

  ngAfterViewInit() {
    this.initializeSpreedly();
  }

  ngOnDestroy() {
    (<any>window).Spreedly.removeHandlers();
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.userService.$profile.subscribe((profile) => {
        if (profile.user.is_superuser) {
          this.cardForm.get('address1').setValidators([]);
          this.cardForm.get('city').setValidators([]);
          this.cardForm.get('state').setValidators([]);
          this.cardForm.get('postalCode').setValidators([]);
        }
      })
    );
    this.subscriptions.add(
      this.userService.$selectedOrgBillable.subscribe((billable: boolean) => {
        this.orgBillable = billable;
      })
    );
  }

  public save() {
    (<any>window).Spreedly.validate();
    (<any>window).Spreedly.tokenizeCreditCard({
      full_name: this.cardForm.controls.name.value,
      month: this.cardForm.controls.expiration.value.substr(0, 2),
      year: this.cardForm.controls.expiration.value.substr(3, 6),
      address1: this.cardForm.controls.address1.value,
      address2: this.cardForm.controls.address2.value,
      city: this.cardForm.controls.city.value,
      state: this.cardForm.controls.state.value,
      zip: this.cardForm.controls.postalCode.value,
    });
  }

  private initializeSpreedly() {
    if (this.environment.SPREEDLY_ENVIRONMENT_KEY !== '') {
      (<any>window).Spreedly.init(this.environment.SPREEDLY_ENVIRONMENT_KEY, {
        numberEl: 'ccNum',
        cvvEl: 'ccCVV',
      });

      (<any>window).Spreedly.on('ready', () => {
        (<any>window).Spreedly.setFieldType('number', 'text');
        (<any>window).Spreedly.setNumberFormat('prettyFormat');
        (<any>window).Spreedly.setStyle('number', NUMBER_FORMAT);
        (<any>window).Spreedly.setStyle('cvv', NUMBER_FORMAT);
      });

      (<any>window).Spreedly.on(
        'validation',
        (validationObject: ValidationObject) => {
          this.zone.run(() => {
            if (validationObject.numberLength === 0) {
              this.cardForm.controls.number.setErrors({ required: true });
            } else if (!validationObject.validNumber) {
              this.cardForm.controls.number.setErrors({ invalid: true });
            } else {
              this.cardForm.controls.number.setErrors(null);
            }

            if (validationObject.cvvLength === 0) {
              this.cardForm.controls.cvv.setErrors({ required: true });
            } else if (!validationObject.validCvv) {
              this.cardForm.controls.cvv.setErrors({ invalid: true });
            } else {
              this.cardForm.controls.cvv.setErrors(null);
            }
          });
        }
      );

      (<any>window).Spreedly.on('paymentMethod', (token, pmData) => {
        const tokenField = document.getElementById('payment_method_token');
        tokenField.setAttribute('value', token);

        this.zone.run(() => {
          this.paymentService
            .addCard({
              payment_method_token: token,
            })
            .then(() => {
              this.cardAdded.emit();
              this.userService.reloadOrganizationInfo();
              (<any>window).Spreedly.reload();
              this.cardForm.setValue({
                name: '',
                number: '',
                expiration: '',
                cvv: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                postalCode: '',
              });
              this.cardForm.controls.name.setErrors(null);
              this.cardForm.controls.number.setErrors(null);
              this.cardForm.controls.expiration.setErrors(null);
              this.cardForm.controls.cvv.setErrors(null);
              this.cardForm.controls.address1.setErrors(null);
              this.cardForm.controls.city.setErrors(null);
              this.cardForm.controls.state.setErrors(null);
              this.cardForm.controls.postalCode.setErrors(null);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      });

      (<any>window).Spreedly.on('errors', (errors) => {
        errors.forEach(
          (error: { attribute: string; key: string; message: string }) => {
            this.zone.run(() => {
              this.snackBarService.open(error.message);
            });
            return;
          }
        );
      });

      (<any>window).Spreedly.on(
        'fieldEvent',
        (
          name: string,
          type: string,
          _activeEl: string,
          _inputProperties: object
        ) => {
          if (
            (name === 'number' || name === 'cvv') &&
            (type === 'input' || type === 'blur' || type === 'tab')
          ) {
            this.cardForm.controls[name].markAsTouched();
            (<any>window).Spreedly.validate();
          }
        }
      );
    }
  }
}
