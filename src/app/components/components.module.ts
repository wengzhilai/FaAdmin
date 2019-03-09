import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModelComponent } from './edit-model/edit-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../Lib/ngx-translate/public_api';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  entryComponents:[EditModelComponent],
  declarations: [EditModelComponent],
  imports: [
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PipesModule,
  ],
  exports:[
    EditModelComponent
  ]
})
export class ComponentsModule { }
