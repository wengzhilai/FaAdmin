import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';




import { TranslateModule } from '../../Lib/ngx-translate/public_api';
import { ComponentsModule } from '../../components/components.module';
import { QuartzTaskRoutingModule, routedComponents } from './quartz-task.routes';
import { EditModelComponent } from '../../components/edit-model/edit-model.component';


@NgModule({
  entryComponents: [
    EditModelComponent
  ],
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    QuartzTaskRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [
    routedComponents
  ],

  exports: [
  ],
})
export class QuartzTaskModule {
}
