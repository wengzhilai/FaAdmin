import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
  selector: 'ngx-query-edit',
  templateUrl: './query-edit.component.html',
  styleUrls: ['./query-edit.component.scss']
})
export class QueryEditComponent implements OnInit {

  title: string;
  messageList: any[] = [];
  buttons = []
  inputs = []
  /**
   * 所有列表的值
   */
  ItmeArr=new Array<any>();
  bean = {}
  screenheight=document.documentElement.clientHeight-300
  constructor(
    public windowRef: NbWindowRef
  ) {
    console.log(this.windowRef.config.context)
  }

  ngOnInit() {
    for (const key in this.inputs) {
      let element = this.inputs[key];
      element["name"]=key
      this.ItmeArr.push(element);
    }
    console.log(this.ItmeArr)
  }
  ButtonClick(even) {
    even(this.bean)
    .then(x => {
      console.log(x)
      this.windowRef.close();
    })
  }

}
