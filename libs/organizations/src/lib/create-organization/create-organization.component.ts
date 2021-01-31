import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FirestoreService,
  OrganizationService,
  OrganizationTypeString,
  PhoneNumberService,
  Profile,
  SnackBarService,
  TermsAndConditionsComponent,
  UserService,
} from '@marketplace/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const PHONE_REGEX = /^\([0-9]{3}\) [0-9]{3} - [0-9]{4}$/;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  @ViewChild('name', { static: true }) nameInput: ElementRef;
  @ViewChild('location', { static: true }) locationInput: ElementRef;

  private businessTypes: Array<{ name: string }> = [];
  private location: google.maps.places.PlaceResult;
  private profile: Profile;

  public createOrganizationForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    category: new FormControl(null),
    location: new FormControl(null),
    phone: new FormControl(null, [
      Validators.pattern(PHONE_REGEX),
      Validators.required,
    ]),
    political: new FormControl(null, [Validators.required]),
    type: new FormControl(OrganizationTypeString.MARKETPLACE, [
      Validators.required,
    ]),
    terms_accepted: new FormControl(null, [Validators.requiredTrue]),
  });

  public filteredTypes: Observable<Array<any>>;
  public hasOrganization: boolean;
  public hasPhoneNumber: boolean;
  public organizationTypes = OrganizationTypeString;
  public returnUrl: string;
  public savingOrganization = false;
  public submitted = false;

  constructor(
    private dialog: MatDialog,
    private firestoreService: FirestoreService,
    private organizationService: OrganizationService,
    private phoneNumberService: PhoneNumberService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBarService,
    public userService: UserService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  ngOnInit() {
    this.firestoreService.getBusinessTypes().subscribe((types: Array<any>) => {
      this.businessTypes = types;
    });

    this.filteredTypes = this.createOrganizationForm.controls.category.valueChanges.pipe(
      startWith<string | { name: string }>(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this.filter(name) : []))
    );

    const subscription = this.userService.$profile.subscribe(
      (profile: Profile) => {
        this.profile = profile;
        this.hasOrganization = profile.organizations.length ? true : false;
        this.hasPhoneNumber = profile.user.phone ? true : false;

        const phone = profile.user.phone;
        const formattedPhone = phone
          ? this.phoneNumberService.formatPhoneNumber(phone)
          : null;
        this.createOrganizationForm.patchValue({
          terms_accepted: this.hasOrganization,
          phone: formattedPhone,
        });
        setTimeout(() => {
          subscription.unsubscribe();
        });
      }
    );
  }

  /**
   * Create an organization
   */
  public async create() {
    // If terms of service or political is not selected, this will show an error on those fields
    this.submitted = true;

    if (this.createOrganizationForm.invalid) {
      return;
    }

    this.savingOrganization = true;
    try {
      if (!this.hasPhoneNumber && !this.hasOrganization) {
        await this.saveTermsAndPhone();
      } else if (!this.hasPhoneNumber) {
        await this.savePhoneNumber();
      } else if (!this.hasOrganization) {
        await this.userService.terms();
      }

      // Joins form with JSON location data
      let found = false;
      for (let i = 0; i < this.businessTypes.length; i++) {
        const element = this.businessTypes[i];
        if (
          this.createOrganizationForm.controls.category.value &&
          element.name &&
          this.createOrganizationForm.controls.category.value.toLowerCase() ===
            element.name.toLowerCase()
        ) {
          found = true;
          break;
        }
      }

      // If there isn't a matching business type
      if (!found && this.createOrganizationForm.controls.category.value) {
        const value = this.createOrganizationForm.controls.category.value.toLowerCase();
        const firstLetter = value.charAt(0).toUpperCase();
        const categoryName = firstLetter + value.slice(1);
        await this.firestoreService.addBusinessType({ name: categoryName });
        this.createOrganizationForm.patchValue({
          category: categoryName,
        });
      }

      // Create new organization
      const form = {
        ...this.createOrganizationForm.value,
        location: this.location,
      };
      const success = await this.organizationService.create(form);
      if (success) {
        this.snackBar.openTranslation('SUCCESS.SAVING', {
          key: 'type',
          translation: 'ORGANIZATION.TEXT',
        });
        this.router.navigateByUrl(this.returnUrl);
      }
    } catch (err) {
      this.snackBar.openTranslation('ERROR.SAVING', {
        key: 'type',
        translation: 'ORGANIZATION.TEXT',
      });
    } finally {
      this.savingOrganization = false;
    }
  }

  private filter(name: string): Array<{ name: string }> {
    if (name.length < 3) {
      return [];
    }

    const filterValue = name.toLowerCase();
    return this.businessTypes.filter(
      (type) => type.name.toLowerCase().includes(filterValue) === true
    );
  }

  public openTerms() {
    this.dialog.open(TermsAndConditionsComponent, {
      minWidth: '50vw',
      maxWidth: '60vw',
    });
  }

  public async savePhoneNumber() {
    this.profile.user.phone = this.phoneNumberService.cleanPhoneNumber(
      this.createOrganizationForm.controls.phone.value
    );
    await this.userService.updateProfile(this.profile);
    return Promise.resolve();
  }

  public async saveTermsAndPhone() {
    // Update Terms of Service accepted
    const profile = this.profile;
    const user = { ...profile.user };
    user.terms_accepted = true;
    profile.user = user;

    // Update Phone number
    this.profile.user.phone = this.phoneNumberService.cleanPhoneNumber(
      this.createOrganizationForm.controls.phone.value
    );

    // Save Profile
    return this.userService.updateProfile(profile);
  }

  /**
   * Update the form from Google Places Autocomplete
   * @param location Places data in JSON (see google-places.directive)
   */
  public updateForm(location: google.maps.places.PlaceResult): void {
    this.location = location;
    this.createOrganizationForm.patchValue({
      location: location.formatted_address,
    });

    if (!location.formatted_address) {
      this.locationInput.nativeElement.focus();
    } else {
      this.nameInput.nativeElement.focus();
    }
  }
}
