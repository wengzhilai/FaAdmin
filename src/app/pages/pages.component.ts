import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { HttpHelper } from '../Helper/HttpHelper';
import { DtoResultObj } from '../Model/DtoRec/DtoResult';
import { NbMenuItem } from '@nebular/theme';
import { Fun } from '../Config/Fun';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;
  cfgMenu: NbMenuItem[]
  constructor(
    public httpHelper: HttpHelper,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.LoadModule();
    }, 100);
  }

  LoadModule() {
    this.httpHelper.Post("Module/GetUserMenu", null).then((x: DtoResultObj<any>) => {
      if(!x.IsSuccess){
        Fun.Hint(x.Msg);
        return;
      }
      let nowMenu = this.JsonToMenuItemJson(x.DataList)
      var frist:NbMenuItem[]=[{
        title: "首页",
        icon: 'nb-e-commerce',
        link: '/pages/dashboard',
      }]

      this.menu = nowMenu.concat(MENU_ITEMS)
      this.menu =frist.concat(this.menu);
    });
  }




  JsonToMenuItemJson(inJson: any[]) {
    let reArr: NbMenuItem[] = []
    inJson.forEach(element => {
      reArr.unshift({
        data: element["ID"],
        title: element["NAME"],
        icon: element["IMAGE_URL"],
        url: element["LOCATION"],
        children: this.JsonToMenuItemJson(element["Children"])
      })
    });
    if (reArr.length == 0) reArr = null;
    return reArr;

  }

}
