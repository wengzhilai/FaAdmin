import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbLayoutModule,
  NbSidebarModule,

} from '@nebular/theme';


import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { ComponentsModule } from '../../components/components.module';
import { EquipmentRoutingModule, routedComponents } from './equipment.routes';
import { EditModelComponent } from '../../components/edit-model/edit-model.component';
import { TreeModule } from 'angular-tree-component';
import { LookModelComponent } from '../../components/look-model/look-model.component';


@NgModule({
  entryComponents: [
    EditModelComponent,
    LookModelComponent,
  ],
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    EquipmentRoutingModule,
    TranslateModule,
    TreeModule,
    ComponentsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbTabsetModule,
    NbUserModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbLayoutModule,
    NbSidebarModule,

  ],
  declarations: [
    routedComponents
  ],

  exports: [
  ],
})
export class EquipmentModule {
}
