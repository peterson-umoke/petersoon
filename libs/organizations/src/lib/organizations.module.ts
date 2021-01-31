import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations/organizations.component';

@NgModule({
  declarations: [CreateOrganizationComponent, OrganizationsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    OrganizationsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
  ],
})
export class OrganizationsModule {}
