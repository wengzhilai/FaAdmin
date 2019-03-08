import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { routedComponents, ModuleRoutingModule } from './module.routes';
import { ModuleListPage } from './module-list/module-list';
import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    ThemeModule,
    HttpClientModule,
    TranslateModule,
    Ng2SmartTableModule,
    ModuleRoutingModule
  ],
  declarations: [
    routedComponents,
    ModuleListPage,
  ],
  entryComponents: [
  ],
  exports: [
  ],
})
export class ModuleModule {
}
