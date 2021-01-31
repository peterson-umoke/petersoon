import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  AppRoutes,
  ChangeDialogComponent,
  Environment,
  Organization,
  OrganizationService,
  OrganizationTypeString,
  Profile,
  SnackBarService,
  UserService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
})
export class OrganizationsComponent implements OnInit {
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newName', { static: false }) newNameInput: ElementRef;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<Organization>;
  public pageSizeOptions = [10, 25, 100];
  public profile: Profile;

  constructor(
    private dialog: MatDialog,
    private organizationService: OrganizationService,
    private router: Router,
    private snackBar: SnackBarService,
    public userService: UserService,
    private environment: Environment
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.userService.$profile.subscribe((profile: Profile) => {
        if (profile) {
          this.profile = profile;
          this.profile.organizations = profile.organizations.sort(
            this.sortOrganizations
          );
          this.dataSource = new MatTableDataSource(profile.organizations);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
    );
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Change to another organization
   * @param organization
   */
  public changeOrganization(organization: Organization) {
    if (organization.type === OrganizationTypeString.OPERATOR) {
      window.open(`${this.environment.API_URL}/${organization.id}`, '_blank');
    } else {
      this.userService.changeOrganization(organization).then(() => {
        this.router.navigate([AppRoutes.CAMPAIGNS]);
      });
    }
  }

  /**
   * Create a new organization
   */
  public createOrganization() {
    this.router.navigate([AppRoutes.CREATE_ORGANIZATION]);
  }

  /**
   * Bring up the delete confirm dialog
   * @param organizationId
   */
  public delete(organizationId: string) {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_ORGANIZATION' },
    });

    dialogRef.afterClosed().subscribe((deleteAd: boolean) => {
      if (deleteAd) {
        this.organizationService
          .delete(organizationId)
          .then(() => {
            this.snackBar.openTranslation('SUCCESS.DELETING', {
              key: 'type',
              translation: 'ORGANIZATION.TEXT',
            });
          })
          .catch((err) => {
            this.snackBar.openTranslation('ERROR.DELETING', {
              key: 'type',
              translation: 'ORGANIZATION.TEXT',
            });
          });
      }
    });
  }

  /**
   * Edit the name of the organization
   * @param organization
   */
  public edit(organization: Organization) {
    organization['edit'] = true;
    organization['newName'] = organization.name;
    setTimeout(() => {
      this.newNameInput.nativeElement.focus();
    });
  }

  /**
   * Cancel editing name of organization
   * @param organization
   */
  public editClose(organization: Organization) {
    organization['edit'] = false;
    delete organization['newName'];
  }

  /**
   * Save new name of organization
   * @param organization
   */
  public editSave(organization: Organization) {
    const newOrg = { ...organization };
    newOrg.name = newOrg['newName'];
    const locationJson = JSON.stringify(newOrg.location);
    newOrg.location = locationJson;
    this.organizationService
      .update(newOrg)
      .then(() => {
        organization.name = newOrg.name;
        this.snackBar.openTranslation('SUCCESS.UPDATING', {
          key: 'type',
          translation: 'ORGANIZATION.TEXT',
        });
        this.editClose(organization);
      })
      .catch((error) => {
        this.snackBar.openTranslation('ERROR.UPDATING', {
          key: 'type',
          translation: 'ORGANIZATION.TEXT',
        });
      });
  }

  /**
   * A simple sort function by name for organizations
   * @param org1
   * @param org2
   */
  private sortOrganizations(org1: Organization, org2: Organization) {
    if (org1.name.toLowerCase() > org2.name.toLowerCase()) {
      return 1;
    } else if (org1.name.toLowerCase() < org2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
