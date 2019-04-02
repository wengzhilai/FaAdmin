import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHelper } from '../../Helper/HttpHelper';
import { DtoResultObj } from '../../Model/DtoRec/DtoResult';
import { Fun } from '../../Config/Fun';
import { TreeComponent, ITreeOptions } from 'angular-tree-component';

@Component({
  selector: 'Equipment',
  styleUrls: ['./equipment.scss'],
  template: `
    <nb-layout>
      <nb-sidebar>
        <tree-root #tree [nodes]="nodes" 
        (activate)="onSelect($event)"
        [options]="options"></tree-root>
      </nb-sidebar>
      <nb-layout-column>
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>      
  `,
})
export class EquipmentComponent  implements OnInit {
  @ViewChild('tree') tree: TreeComponent;

  menu = [];

    /** 菜单 */
    nodes = [];
    /** 配置 */
    options: ITreeOptions = {
      childrenField: "child",
      displayField: "V",
      idField: "K",
  
    };
  constructor(
    private httpHelper: HttpHelper,
  ) {
  }
  
  ngOnInit() {
    this.LoadModule();
  }

  LoadModule() {
    this.httpHelper.Post("Equipment/GetTree", null).then((x: DtoResultObj<any>) => {
      if(!x.IsSuccess){
        Fun.Hint(x.Msg);
        return;
      }
      this.nodes=x.DataList;
      // let nowMenu = this.JsonToMenuItemJson(x.DataList)
      // var frist:NbMenuItem[]=[{
      //   title: "首页",
      //   icon: 'nb-e-commerce',
      //   link: '/pages/dashboard',
      // }]
      // this.menu =frist.concat(this.menu);
    });
  }

  onSelect(obj) {
    console.log(obj.node.data);
    // var tmp = this.tree.treeModel.selectedLeafNodeIds;
    // let v = []
    // for (const key in tmp) {
    //   if (tmp[key]) {
    //     v.push(key);
    //   }
    // }
  }

}
