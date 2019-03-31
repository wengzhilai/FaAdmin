import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModelComponent } from './edit-model/edit-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../Lib/ngx-translate/public_api';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { QueryEditComponent } from './query-edit/query-edit.component';
import { ThemeModule } from '../@theme/theme.module';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { TreeModule } from 'angular-tree-component';
import { InputSelectComponent } from './input-select/input-select.component';
import { TableEditComponent } from './table-edit/table-edit.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  entryComponents: [EditModelComponent, QueryEditComponent, RoleEditComponent, TableEditComponent],
  declarations: [EditModelComponent, QueryEditComponent, RoleEditComponent, InputSelectComponent, TableEditComponent],
  imports: [
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PipesModule,
    ThemeModule,
    TreeModule,
    Ng2SmartTableModule,
  ],
  exports: [
    EditModelComponent,
    QueryEditComponent,
    RoleEditComponent,
    TableEditComponent
  ]
})
export class ComponentsModule { }
