import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { ApiResponse, Card, Payment } from '../../models';
import { HttpService } from '../http.service';

export type ExchangeCurrencyCode =
  | 'USD' // US Dollar
  | 'MXN' // Mexican Peso
  | 'CAD' // Canadian dollar (loonie)
  | 'EUR' // Euro
  | 'GBP' // Pound Sterling
  | 'CLP' // Chilean Peso
  | 'HNL' // Honduran Lempira
  | 'PEN' // Peruvian Sol
  | 'CRC' // Costa Rican Colon
  | 'SVC' // Salvadorian Colon
  | 'COP' // Colombia Peso
  | 'ARS'; // Argentinian Peso

@Injectable({
  providedIn: 'root',
})
export class PaymentApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Add a card
   * orgId
   * @param obj payment method token received from spreedly
   */
  public addCard(
    orgId: string,
    obj: { payment_method_token: string }
  ): Observable<Card> {
    return this.http
      .post(`${this.config.API_URL}/api/payment/${orgId}/cards/`, obj)
      .pipe(pluck('result'));
  }

  /**
   * Add a manual payment
   * orgId
   * obj
   */
  public addPayment(
    orgId: string,
    obj: { amount: number; details: { notes: string }; type: string }
  ): Observable<Array<Payment>> {
    return this.http
      .post(`${this.config.API_URL}/api/payment/${orgId}/payments/`, obj)
      .pipe(pluck('result'));
  }

  /**
   * Get a list of cards for the current organization
   * orgId
   */
  public cards(orgId: string): Observable<Array<Card>> {
    return this.http
      .get(`${this.config.API_URL}/api/payment/${orgId}/cards/`)
      .pipe(pluck('result'));
  }

  /**
   * Charge a specific card
   * orgId
   * obj
   */
  public chargeCard(
    orgId: string,
    obj: { cardId: string; amount: number }
  ): Observable<Payment> {
    return this.http
      .post(
        `${this.config.API_URL}/api/payment/${orgId}/cards/${obj.cardId}/payments`,
        obj
      )
      .pipe(pluck('result'));
  }

  /**
   * Delete a card
   * orgId
   * cardId
   */
  public deleteCard(orgId: string, cardId: string): Observable<ApiResponse> {
    return this.http.delete(
      `${this.config.API_URL}/api/payment/${orgId}/cards/${cardId}`
    );
  }

  /**
   * Get the foreign exchange rate to be multiplied by USD
   * currencyCode
   */
  public foreignExchangeRate(
    currencyCode: ExchangeCurrencyCode
  ): Observable<any> {
    return this.http
      .get(`${this.config.API_URL}/api/payment/forex_rate/${currencyCode}/`)
      .pipe(pluck('result'));
  }

  /**
   * Get all payments for an organization
   * orgId
   */
  public getAllPayments(orgId: string): Observable<Array<Payment>> {
    return this.http
      .get(`${this.config.API_URL}/api/payment/${orgId}/payments/`)
      .pipe(pluck('result'));
  }

  /**
   * Get all payments for a specific card
   * orgId
   * cardId
   */
  public getPayments(orgId: string, cardId: string): Observable<any> {
    return this.http
      .get(
        `${this.config.API_URL}/api/payment/${orgId}/cards/${cardId}/payments`
      )
      .pipe(pluck('result'));
  }

  /**
   * Update card information
   * orgId
   * updateCard
   */
  public updateCard(orgId: string, updateCard: Card): Observable<Card> {
    return this.http
      .put(
        `${this.config.API_URL}/api/payment/${orgId}/cards/${updateCard.id}`,
        updateCard
      )
      .pipe(pluck('result'));
  }
}
