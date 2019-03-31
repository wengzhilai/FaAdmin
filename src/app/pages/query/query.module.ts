import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { QueryListPage } from './query-list/query-list';
import { QueryRoutingModule } from './query.routes';
import { QueryQueryComponent } from './query/query';
import { QueryComponent } from './query.component';
import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { ComponentsModule } from '../../components/components.module';
import { QueryEditComponent } from '../../components/query-edit/query-edit.component';
import { TableEditComponent } from '../../components/table-edit/table-edit.component';


@NgModule({
  entryComponents: [
    QueryEditComponent,
    TableEditComponent,
  ],
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    QueryRoutingModule,
    TranslateModule,
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
