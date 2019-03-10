import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfilePage } from './user-profile/user-profile';

export const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
    children: [
      {
        path: 'Profile',
        component: UserProfilePage,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }

export const routedComponents = [
];