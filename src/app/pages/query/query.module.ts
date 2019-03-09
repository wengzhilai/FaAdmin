import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { QueryListPage } from './query-list/query-list';
import { QueryRoutingModule } from './query.routes';
import { QueryQueryComponent } from './query/query';
import { QueryComponent } from './query.component';
import { RoleModule } from "../role/role.module";
import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { ComponentsModule } from '../../components/components.module';
import { EditModelComponent } from '../../components/edit-model/edit-model.component';


@NgModule({
  entryComponents: [
    EditModelComponent
  ],
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    QueryRoutingModule,
    TranslateModule,
    RoleModule,
    ComponentsModule
  ],
  declarations: [
    QueryListPage,
    QueryQueryComponent,
    QueryComponent,
  ],

  exports: [
  ],
})
export class QueryModule {
}
