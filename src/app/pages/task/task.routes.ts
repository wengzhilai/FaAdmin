import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TaskComponent } from './task.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    // children: [
    //   {
    //     path: 'list',
    //     component: QuartzTaskListPage,
    //   }
    // ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule { }

export const routedComponents = [
  TaskComponent,
];