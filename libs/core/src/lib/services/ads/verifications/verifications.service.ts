import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AdApiService } from '../../../api';
import { AdImage } from '../../../models';
import { LoadingService } from '../../loading/loading.service';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class VerificationsService {
  private images: Array<AdImage> = [];
  private subscriptions: Subscription = new Subscription();
  private verifications: BehaviorSubject<Array<AdImage>> = new BehaviorSubject<
    Array<AdImage>
  >([]);

  public $verifications: Observable<
    Array<AdImage>
  > = this.verifications.asObservable();

  constructor(
    private adApiService: AdApiService,
    private loadingService: LoadingService,
    private userService: UserService
  ) {
    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe(() => {
        this.reset();
      })
    );
  }

  /**
   * Approve any number of verifications
   * @param ids
   */
  private approve(ids: Array<string>): void {
    this.loadingService.setLoading(true);
    this.adApiService
      .approveVerification(ids)
      .toPromise()
      .then(() => {
        ids.forEach((id: string) => {
          this.delete(id);
        });
        this.verifications.next(this.images);
      })
      .catch((error) => {
        console.log(`ERROR: ${error}`);
      })
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  /**
   * Approve all verification images
   */
  public approveAll(): void {
    const ids = this.images.map((image: AdImage) => {
      return image.id;
    });
    this.approve(ids);
  }

  /**
   * Approve a single verification image
   * @param id
   */
  public approveImage(id: string): void {
    this.approve([id]);
  }

  /**
   * Delete a single image from the cache
   * @param id
   */
  private delete(id: string): void {
    this.images = this.images.filter((image: AdImage) => {
      return image.id !== id;
    });
  }

  /**
   * Get verifications for the current organization
   */
  public getVerifications(): void {
    this.loadingService.setLoading(true);
    this.adApiService
      .getVerifications(this.userService.organization.id)
      .toPromise()
      .then((verifications: Array<AdImage>) => {
        this.images = verifications;
        this.verifications.next(this.images);
        this.loadingService.setLoading(false);
      })
      .catch((error) => {
        this.images = [];
        this.verifications.next(this.images);
        this.loadingService.setLoading(false);
      })
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  /**
   * Delete all verification images
   */
  public rejectAll(): void {
    const ids = this.images.map((image: AdImage) => {
      return image.id;
    });

    ids.forEach((id: string) => {
      this.rejectImage(id);
    });
  }

  /**
   * Delete a single verification image
   * @param id
   */
  public rejectImage(id: string): void {
    this.loadingService.setLoading(true);
    this.adApiService
      .deleteImage(id)
      .toPromise()
      .then(() => {
        this.delete(id);
        this.verifications.next(this.images);
      })
      .catch((error) => {
        console.log(`ERROR: ${error}`);
      })
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  public reset() {
    this.images = [];
    this.verifications.next([]);
  }
}
