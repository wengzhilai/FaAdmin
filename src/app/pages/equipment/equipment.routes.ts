import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EquipmentComponent } from './equipment.component';
import { EquipmentListComponent } from './list/list';

export const routes: Routes = [
  {
    path: '',
    component: EquipmentComponent,
    children: [
      {
        path: 'list',
        component: EquipmentListComponent,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule { }

export const routedComponents = [
  EquipmentComponent,
  EquipmentListComponent,
];