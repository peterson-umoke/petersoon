import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { NewUserComponent } from './new-user/new-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

const components = [NewUserComponent, UserListComponent, UsersComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    CoreModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
