import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NbWindowService, NbWindowRef } from '@nebular/theme';

@Component({
  selector: 'ngx-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss']
})
export class EditModelComponent implements OnInit {

  title: string;
  messageList: any[] = [];
  buttons = []
  inputs = []
  /**
   * 所有列表的值
   */
  ItmeArr=new Array<any>();
  bean = {}
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
    even(this.bean).then(x => {
      console.log(x)
      this.windowRef.close();
    })
  }

}
