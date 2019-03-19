import { Component, OnInit, ViewChild } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import { HttpHelper } from '../../Helper/HttpHelper';
import { DtoResultObj } from '../../Model/DtoRec/DtoResult';

@Component({
  selector: 'ngx-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  title: string;
  messageList: any[] = [];
  buttons = []
  inputs = []
  /**
   * 所有列表的值
   */

  ItmeArr = new Array<any>();
  bean = {}
  /** 菜单 */
  nodes = [];
  /** 配置 */
  options: ITreeOptions = {
    useCheckbox: true,
    childrenField: "Children",
    displayField: "NAME",
    idField: "ID",

  };
  moduleIdStr;
  @ViewChild('tree') tree: TreeComponent;
  screenheight = document.documentElement.clientHeight - 300
  constructor(
    public windowRef: NbWindowRef,
    public httpHelper: HttpHelper,
  ) {
    console.log(this.windowRef.config.context)
  }

  ngOnInit() {
    console.log(this.bean);

    for (const key in this.inputs) {
      let element = this.inputs[key];
      element["name"] = key
      this.ItmeArr.push(element);
    }
    console.log(this.ItmeArr)

    this.LoadModule();
  }

  ButtonClick(even) {
    even(this.bean)
      .then((x: DtoResultObj<any>) => {
        console.log(x)
        if (x.IsSuccess) {
          this.windowRef.close();
        }
      })
  }

  LoadModule() {
    this.httpHelper.Post("Module/GetUserMenu", null).then((x: DtoResultObj<any>) => {
      this.nodes = x.DataList;
      console.log(this.bean)
      this.bean["moduleIdStr"].forEach(element => {
        this.tree.treeModel.selectedLeafNodeIds[element] = true
      });
    });
  }
  onSelect(obj) {
    var tmp = this.tree.treeModel.selectedLeafNodeIds;
    let v = []
    for (const key in tmp) {
      if (tmp[key]) {
        v.push(key);
      }
    }
    this.bean["moduleIdStr"] = v;
  }
}
