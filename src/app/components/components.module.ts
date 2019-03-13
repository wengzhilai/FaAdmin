import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModelComponent } from './edit-model/edit-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../Lib/ngx-translate/public_api';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { QueryEditComponent } from './query-edit/query-edit.component';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  entryComponents:[EditModelComponent,QueryEditComponent],
  declarations: [EditModelComponent, QueryEditComponent],
  imports: [
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PipesModule,
    ThemeModule,
  ],
  exports:[
    EditModelComponent,
    QueryEditComponent
  ]
})
export class ComponentsModule { }
