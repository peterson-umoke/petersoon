import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDialogComponent,
  Organization,
  Profile,
  SnackBarService,
  UserService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

const USER_ROLES = [
  'ADMIN',
  // 'ANALYST',
  // 'BIDDER',
  // 'MEMBER',
  // 'SALES_MGR'
];

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  private organization: Organization;
  private subscriptions: Subscription = new Subscription();
  private translations = { delete_user: '', transfer_ownership: '' };

  public canChangeOwner = false;
  public canDeleteUser = false;
  public newUserForm = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    roles: new FormControl(null, [Validators.required]),
  });
  public submitted = false;
  public rolesDisabled = false;
  public user;
  public userId: string;
  public userRoles = USER_ROLES;

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private snackBarService: SnackBarService,
    private router: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.router.params.subscribe((params) => {
        if (params && params['id']) {
          this.userId = params['id'];
          this.getUserData();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Add a new user or update roles of an existing user
   */
  public async addorUpdateUser() {
    if (!this.userId) {
      this.newUserForm.patchValue({
        roles: ['ADMIN'],
      });
    }
    this.submitted = true;
    if (this.newUserForm.invalid) {
      return;
    }
    if (this.userId) {
      // If owner is selected
      try {
        if (this.newUserForm.controls.roles.value.indexOf('OWNER') > -1) {
          await this.transferOwnership();
        }
      } finally {
        const newForm = { ...this.newUserForm.value, id: this.userId };
        this.userService.updateUserFromOrg(this.organization.id, newForm);
        this.goBack();
      }
    } else {
      try {
        await this.userService.addUserToOrg(this.newUserForm.value);
        this.snackBarService.openTranslation('SUCCESS.UPDATING', {
          key: 'type',
          translation: 'ORGANIZATION.TEXT',
        });
        this.goBack();
      } catch (error) {
        this.snackBarService.openTranslation('ERROR.UPDATING', {
          key: 'type',
          translation: 'ORGANIZATION.TEXT',
        });
      }
    }
  }

  /**
   * Deletes selected user from organization
   * @param userId
   */
  public deleteUserFromOrg() {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_USER' },
    });

    dialogRef.afterClosed().subscribe(async (deleteUser: boolean) => {
      if (deleteUser) {
        this.userService
          .deleteUserFromOrg(this.organization.id, this.user.id)
          .then(() => {
            this.goBack();
          });
      }
    });
  }

  public disableRoles() {
    if (this.newUserForm.controls.roles.value.indexOf('OWNER') > -1) {
      this.rolesDisabled = true;
    } else {
      this.rolesDisabled = false;
    }
  }

  /**
   * Get a user by id on current organization
   */
  private async getUserData() {
    const orgSubscription = this.userService.$selectedOrganization.subscribe(
      async (organization: Organization) => {
        this.organization = organization;
        if (organization && organization.id) {
          const user = await this.userService.getUserFromOrg(
            this.organization.id,
            this.userId
          );
          this.user = user.result;
          this.setUserInfo();
          setTimeout(() => {
            orgSubscription.unsubscribe();
          });
        }
      }
    );

    const currentUserSubscription = this.userService.$profile.subscribe(
      async (profile: Profile) => {
        if (profile && profile.user) {
          const editingSelf = profile.user.id === this.userId;
          if (editingSelf) {
            this.canDeleteUser = false;
            this.canChangeOwner = false;
            // Not editing yourself
          } else {
            // You are owner  (TODO once more roles added in: -->) or admin of organization
            if (
              this.organization &&
              this.organization.owner === profile.user.id
            ) {
              this.canDeleteUser = true;
              this.canChangeOwner = true;
            } else {
              this.canDeleteUser = false;
              this.canChangeOwner = false;
            }
          }
        }

        setTimeout(() => {
          currentUserSubscription.unsubscribe();
        });
      }
    );
  }

  public goBack() {
    this.location.back();
  }

  /**
   * Transfers ownership for current organization
   */
  public async transferOwnership(): Promise<any> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ChangeDialogComponent, {
        data: { action: 'USERS.MAKE_OWNER', type: 'CHANGE.TRANSFER_OWNERSHIP' },
      });
      dialogRef.afterClosed().subscribe(async (ownerChanged: boolean) => {
        if (ownerChanged) {
          this.newUserForm.patchValue({
            roles: ['OWNER'],
          });
          resolve();
        }
      });
    });
  }

  private setUserInfo() {
    if (this.user.first_name) {
      this.newUserForm.controls.first_name.disable();
    }
    if (this.user.last_name) {
      this.newUserForm.controls.last_name.disable();
    }
    if (this.user.email) {
      this.newUserForm.controls.email.disable();
    }

    this.newUserForm.setValue({
      first_name: this.user.first_name ? this.user.first_name : '',
      last_name: this.user.last_name ? this.user.last_name : '',
      email: this.user.email ? this.user.email : '',
      roles: this.user.roles ? this.user.roles : '',
    });
  }
}
