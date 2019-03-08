import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { routedComponents, RoleRoutingModule } from './role.routes';
import { RoleListPage } from './role-list/role-list';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    RoleRoutingModule,
  ],
  declarations: [
    routedComponents,
    RoleListPage,
  ],
  entryComponents: [
  ],
  exports: [
  ],
})
export class RoleModule {
}
