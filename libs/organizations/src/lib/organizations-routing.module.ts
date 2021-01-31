import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { OrganizationsComponent } from './organizations/organizations.component';

const routes: Routes = [
  { path: '', component: OrganizationsComponent },
  { path: 'create', component: CreateOrganizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsRoutingModule {}
