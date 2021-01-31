import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Environment } from '../../models';

interface FreeDesign {
  available: boolean;
  description: string;
  webhookToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private firestore: AngularFirestore,
    private environment: Environment
  ) {}

  public async addTemplateSize(width: number, height: number) {
    return this.firestore.collection('template-sizes').add({ height, width });
  }

  public createTemplate(obj: any) {
    return this.firestore.collection('templates').add(obj);
  }

  /**
   * Add a new business type
   * @param obj
   */
  public addBusinessType(obj: { name: string }) {
    return this.firestore.collection('business-types').add(obj);
  }

  /**
   * Update last login timestamp
   * Gets business types list
   */
  public getBusinessTypes(): Observable<Array<any>> {
    return this.firestore
      .collection('business-types', (ref) => ref.orderBy('name'))
      .valueChanges();
  }

  /**
   * Get the list of template sizes
   */
  public templateFonts() {
    return this.firestore
      .collection<{ fonts: Array<string>; url: string }>('template-fonts')
      .valueChanges();
  }

  /**
   * Get the list of template sizes
   */
  public templateSizes() {
    return this.firestore
      .collection<{ width: number; height: number }>('template-sizes', (ref) =>
        ref.orderBy('width')
      )
      .valueChanges();
  }

  /**
   * Set up a new user in firestore
   * @param user The new user who just signed in
   */
  public async newUser(user: firebase.User) {
    this.updateFirestore(user);
  }

  /**
   * Update firebase with last login and existing user fields
   * @param user
   */
  private async updateFirestore(user: firebase.User) {
    const docRef = `users/${user.uid}`;
    try {
      await this.firestore
        .doc(docRef)
        .update({ lastLogin: moment().format('X') });
    } catch (error) {
      await this.firestore.doc(docRef).set({
        existingUser: true,
        lastLogin: moment().format('X'),
      });
    } finally {
      return Promise.resolve();
    }
  }

  /**
   * Update last login timestamp
   * @param user
   */
  public async updateLastLogin(user: firebase.User): Promise<void> {
    this.updateFirestore(user);
  }

  /**
   * Updates Ad template in firebase
   * @param templateId
   */
  public updateTemplate(templateId: string, template: any): Promise<void> {
    return this.firestore.doc(`templates/${templateId}`).update(template);
  }

  /**
   * Get the Free Design in 15 minutes observable
   */
  public design15TeamAvailable(): Observable<FreeDesign[]> {
    return this.firestore
      .collection<FreeDesign>('design', (ref) =>
        ref.where('webhookToken', '==', this.environment.DESIGN_15_SLACK_TOKEN)
      )
      .valueChanges();
  }
}
