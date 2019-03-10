import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { routedComponents,UserRoutingModule } from './user.routes';
import { UserProfilePage } from './user-profile/user-profile';


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    UserRoutingModule,
  ],
  declarations: [
    routedComponents,
    UserProfilePage,
  ],
  entryComponents: [
  ],
  exports: [

  ],
})
export class UserModule {
}
