import { Injectable } from '@angular/core';
import { ExchangeCurrencyCode, PaymentApiService } from '../../api';
import { Card, Payment } from '../../models';
import { LoadingService } from '../../services/loading/loading.service';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { TranslationService } from '../../services/translation/translation.service';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private _cards: Array<Card> = [];
  private cardsText: string;
  private paymentText: string;
  private paymentsText: string;

  constructor(
    private loadingService: LoadingService,
    private paymentApiService: PaymentApiService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private userService: UserService
  ) {
    setTimeout(() => {
      this.translationService
        .getTranslation(['CREDIT_CARD.CARD', 'PAYMENT.TEXT', 'PAYMENT.PLURAL'])
        .subscribe((text: string) => {
          this.cardsText = text['CREDIT_CARD.CARD'];
          this.paymentText = text['PAYMENT.TEXT'];
          this.paymentsText = text['PAYMENT.PLURAL'];
        });
    });
  }

  /**
   * Get a list of cards for the current organization
   */
  public cards(force: boolean = false): Promise<Array<Card>> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      if (!this._cards.length || force) {
        this.paymentApiService
          .cards(this.userService.organization.id)
          .subscribe(
            (result) => {
              this.loadingService.setLoading(false);
              this._cards = result;
              resolve(result);
            },
            (error) => {
              this.loadingService.setLoading(false);
              this.translationService
                .getTranslation('ERROR.LOADING', { type: this.cardsText })
                .subscribe((text: string) => {
                  this.snackBarService.open(text);
                });
              reject(error);
            }
          );
      } else {
        resolve(this._cards);
        this.loadingService.setLoading(false);
      }
    });
  }

  public addCard(obj: { payment_method_token: string }): Promise<Card> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .addCard(this.userService.organization.id, obj)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('SUCCESS.SAVING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            this._cards.push(result);
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('ERROR.SAVING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }

  /**
   * Add a manual payment
   */
  public addPayment(obj: {
    amount: number;
    details: { notes: string };
    type: string;
  }): Promise<Array<Payment>> {
    this.loadingService.setLoading(true);
    obj['organization'] = this.userService.organization.id;
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .addPayment(this.userService.organization.id, obj)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('SUCCESS.SAVING', { type: this.paymentText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('ERROR.SAVING', { type: this.paymentText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }

  public chargeCard(obj: { cardId: string; amount: number }): Promise<Payment> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .chargeCard(this.userService.organization.id, obj)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('CREDIT_CARD.CHARGE.SUCCESS')
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('CREDIT_CARD.CHARGE.ERROR')
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }

  public deleteCard(cardId: string): Promise<any> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .deleteCard(this.userService.organization.id, cardId)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('SUCCESS.DELETING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            const cards = [...this._cards];
            cards.forEach((card: Card, index: number) => {
              if (card.id === cardId) {
                cards.splice(index, 1);
                return;
              }
            });
            this._cards = cards;
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('ERROR.DELETING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }

  /**
   * Get the foreign exchange rate to be multiplied by USD
   * currencyCode
   */
  public foreignExchangeRate(currencyCode: ExchangeCurrencyCode): Promise<any> {
    return new Promise((resolve, reject) => {
      this.paymentApiService.foreignExchangeRate(currencyCode).subscribe(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Get all payments for the organization
   */
  public getAllPayments(): Promise<Array<Payment>> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .getAllPayments(this.userService.organization.id)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('ERROR.LOADING', { type: this.paymentsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }

  public getPayments(cardId: string): Promise<any> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .getPayments(this.userService.organization.id, cardId)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            reject(error);
          }
        );
    });
  }

  public reset() {
    this._cards = [];
  }

  public updateCard(updateCard: Card): Promise<Card> {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.paymentApiService
        .updateCard(this.userService.organization.id, updateCard)
        .subscribe(
          (result) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('SUCCESS.UPDATING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            const cards = [...this._cards];
            cards.forEach((card: Card, index: number) => {
              if (card.id === updateCard.id) {
                cards.splice(index, 1, result);
                return;
              }
            });
            this._cards = cards;
            resolve(result);
          },
          (error) => {
            this.loadingService.setLoading(false);
            this.translationService
              .getTranslation('ERROR.UPDATING', { type: this.cardsText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
            reject(error);
          }
        );
    });
  }
}
