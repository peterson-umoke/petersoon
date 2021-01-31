import { Injectable } from '@angular/core';
import { OrganizationApiService } from '../../api';
import { Organization } from '../../models';
import { LoadingService } from '../loading/loading.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(
    private loadingService: LoadingService,
    private organizationApiService: OrganizationApiService,
    private userService: UserService
  ) {}

  public create(form: { name: string; political: boolean }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.organizationApiService
        .create(form)
        .toPromise()
        .then((newOrganization: Organization) => {
          this.userService.createOrganization(newOrganization);
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public delete(organizationId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.organizationApiService
        .delete(organizationId)
        .toPromise()
        .then(() => {
          this.userService.deleteOrganization(organizationId);
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public update(organization: Organization): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.organizationApiService
        .update(organization)
        .toPromise()
        .then(() => {
          this.userService.updateOrganization(organization);
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }
}
