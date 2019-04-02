import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';




import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { ComponentsModule } from '../../components/components.module';
import { EquipmentRoutingModule, routedComponents } from './equipment.routes';
import { EditModelComponent } from '../../components/edit-model/edit-model.component';
import { TreeModule } from 'angular-tree-component';


@NgModule({
  entryComponents: [
    EditModelComponent
  ],
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    EquipmentRoutingModule,
    TranslateModule,
    TreeModule,
    ComponentsModule
  ],
  declarations: [
    routedComponents
  ],

  exports: [
  ],
})
export class EquipmentModule {
}
