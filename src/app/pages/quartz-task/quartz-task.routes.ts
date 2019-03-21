import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuartzTaskComponent } from './quartz-task.component';
import { QuartzTaskListPage } from './quartz-task-list/quartz-task-list';

export const routes: Routes = [
  {
    path: '',
    component: QuartzTaskComponent,
    children: [
      {
        path: 'list',
        component: QuartzTaskListPage,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuartzTaskRoutingModule { }

export const routedComponents = [
  QuartzTaskComponent,
  QuartzTaskListPage,
];