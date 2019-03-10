import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfilePage } from './user-profile/user-profile';
import { NgUserLoginComponent } from './ng-user-login/ng-user-login.component';

export const routes: Routes = [
  {
    path: '',
    component: NgUserLoginComponent,
    children: [
      {
        path: 'Profile',
        component: UserProfilePage,
      },
      {
        path: 'login',
        component:NgUserLoginComponent
      }
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