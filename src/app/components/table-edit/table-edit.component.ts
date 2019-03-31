import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { DtoResultObj } from '../../Model/DtoRec/DtoResult';
import { SmartTableDataSource } from '../../Helper/SmartTableDataSource';
import { LocalDataSource } from 'ng2-smart-table';
import { Fun } from '../../Config/Fun';

@Component({
  selector: 'ngx-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss']
})
export class TableEditComponent implements OnInit {

  title: string;
  messageList: any[] = [];
  buttons = []
  inputs = []
  /**
   * 所有列表的值
   */
  ItmeArr = new Array<any>();
  bean = {}
  screenheight = document.documentElement.clientHeight - 300
  constructor(
    public windowRef: NbWindowRef
  ) {
    console.log(this.windowRef.config.context)
  }

  /**
   * 用于绑定table的设置
   */
  settings: any = Fun.GetTableSetting();
  source: LocalDataSource;

  configJson = {
    "ID": {
      "title": 'ID',
      "type": 'number',
    },
    "NAME": {
      "title": '别名',
      "type": 'string',
    },
    "COLUMN_NAME": {
      "title": '列名',
      "type": 'string',
    },
    "STAUTS": {
      "title": '状态',
      "type": 'string',
      "editor": {
        "type": 'list',
        "config": {
          "list": [
            { "value": "启用", "title": '启用' },
            { "value": "禁用", "title": '禁用' }
          ]
        }
      }
    },
    "ORDER_INDEX": {
      "title": '排序号',
      "type": 'number',
    },
    "COLUMN_TYPE": {
      "title": '列类型',//text,int,datatime,pic,textarea,Checkbox,Radio,auto
      "type": 'string',
      "editor": {
        "type": 'list',
        "config": {
          "list": [
            { "value": "text", "title": '文本' },
            { "value": "int", "title": '数字' },
            { "value": "datatime", "title": '日期' },
            { "value": "pic", "title": '图片' },
            { "value": "textarea", "title": '多行文本' },
            { "value": "Checkbox", "title": '复选框' },
            { "value": "Radio", "title": '单选框' },
            { "value": "auto", "title": '自动' }
          ]
        }
      }
    },
    "COLUMN_LONG": {
      "title": '字段长度',
      "type": 'number',
    },
    "IS_REQUIRED": {
      "title": '必填',
      "type": 'checkbox',
    },
    "DEFAULT_VALUE": {
      "title": '默认值',
      "type": 'string',
    },
    "COLUMN_TYPE_CFG": {
      "title": '列配置内容',
      "type": 'string',
    },
    "AUTHORITY": {
      "title": '权限',
      "type": 'number',
    },
    "INTRODUCE": {
      "title": '介绍',
      "type": 'string',
    },
  }
  ngOnInit() {
    this.settings.columns = this.configJson;
    this.source = new LocalDataSource(this.bean["AllColumns"]);
    for (const key in this.inputs) {
      let element = this.inputs[key];
      element["name"] = key
      this.ItmeArr.push(element);
    }
    this.source.onChanged().subscribe(x => {
      this.bean["AllColumns"] = x.elements;
      console.log(this.bean)
    })

    console.log(this.ItmeArr)
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


}
