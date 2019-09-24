import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { HttpHelper } from '../Helper/HttpHelper';
import { DtoResultObj } from '../Model/DtoRec/DtoResult';
import { NbMenuItem } from '@nebular/theme';
import { Fun } from '../Config/Fun';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
  <ngx-one-column-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-one-column-layout>
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
        link: '/pages/query/query',
        queryParams:{code:'role'},
        home:true
      }]
      console.log(nowMenu)
      nowMenu.forEach(element => {
        element.home=true;

        element.children.forEach(x => {
          x.home=true;
        });
      });
      console.log(nowMenu)

      nowMenu = nowMenu.concat(MENU_ITEMS)
      this.menu =frist.concat(nowMenu);
    });
  }




  JsonToMenuItemJson(inJson: any[]) {
    let reArr: NbMenuItem[] = []
    inJson.forEach(element => {
      let url:String=element["LOCATION"]
      console.log(url)
      if(url==null) url="";
      reArr.unshift({
        data: element["ID"],
        title: element["NAME"],
        icon: element["IMAGE_URL"],
        link: url.split('?')[0],
        queryParams: Fun.UrlToJosn(url),
        home:true,
        children: this.JsonToMenuItemJson(element["Children"])
      })
    });
    if (reArr.length == 0) reArr = null;
    return reArr;

  }

}
