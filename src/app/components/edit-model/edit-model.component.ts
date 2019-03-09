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
  bean = {}
  constructor(
    public windowRef: NbWindowRef
  ) {
    console.log(this.windowRef.config.context)
    
  }

  ngOnInit() {
    for (const key in this.inputs) {
      if (this.inputs.hasOwnProperty(key)) {
        const element = this.inputs[key];
        if (element.hasOwnProperty("value") && element.hasOwnProperty("name")) {
          this.bean[element["name"]] = element["value"]
        }
      }
    }
  }
  ButtonClick(even) {
    even(this.bean).then(x => {
      console.log(x)
      this.windowRef.close();
    })
  }

}
