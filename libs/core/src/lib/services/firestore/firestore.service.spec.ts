import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { Environment } from '../../models';
import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: FirestoreService = TestBed.inject(FirestoreService);
    expect(service).toBeTruthy();
  });
});
