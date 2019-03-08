import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { QueryListPage } from './query-list/query-list';
import { QueryRoutingModule } from './query.routes';
import { QueryQueryComponent } from './query/query';
import { QueryComponent } from './query.component';
import { RoleModule } from "../role/role.module";


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    QueryRoutingModule,
    RoleModule,
  ],
  declarations: [
    QueryListPage,
    QueryQueryComponent,
    QueryComponent,
    
  ],
  entryComponents: [
  ],
  exports: [
  ],
})
export class QueryModule {
}
