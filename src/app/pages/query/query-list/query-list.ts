import { Component, OnInit, ViewChild, ElementRef, ContentChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { SmartTableDataSource } from '../../../Helper/SmartTableDataSource';
import { Fun } from '../../../Config/Fun';
import { DtoResult, DtoResultObj } from '../../../Model/DtoRec/DtoResult';
import { NbWindowService } from '@nebular/theme';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { DtoSaveObj } from '../../../Model/DtoPost/DtoSaveObj';
import { DtoDo } from '../../../Model/DtoPost/DtoDo';
import { QueryEditComponent } from '../../../components/query-edit/query-edit.component';

@Component({
  selector: 'query-list',
  templateUrl: './query-list.html',
  styleUrls: ['./query-list.scss']
})
export class QueryListPage implements OnInit {
  @ViewChild('samrtTable', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('btnHead') template;
  source: LocalDataSource = new LocalDataSource();
  /** 静态方法，获取默认配置 */
  settings: any = SmartTableDataSource.getDefaultSetting();
  configJson: any = {}
  /** 显示的列数 */
  clmNum: number = 0
  constructor(
    private HttpHelper: HttpHelper,
    private windowService: NbWindowService,
    private renderer: Renderer2
  ) {
    let smartTableCofnig: ServerSourceConf = new ServerSourceConf();
    smartTableCofnig.endPoint = 'Query/List';
    smartTableCofnig.pagerLimitKey = ""
    this.source = new SmartTableDataSource(this.HttpHelper, smartTableCofnig);
    this.configJson = {
      "ID": {
        "title": '查询ID',
        "type": 'number',
        "filter": false,
        "editable": false
      },
      "NAME": {
        "title": '查询名',
        "filter": true,
        "type": 'string'
      },
      "CODE": {
        "title": '代码',
        "type": 'string'
      },
      "AUTO_LOAD": {
        "title": '自动加载',
        "defaultValue": 1,
        "type": 'string',
        "editor": {
          "type": 'list',
          "config": {
            "list": [
              { "value": true, "title": '是' },
              { "value": false, "title": '否' }
            ]
          }
        }
      },
      "PAGE_SIZE": {
        "title": '页面大小',
        "type": 'number',
        "defaultValue": 10
      },
      "SHOW_CHECKBOX": {
        "title": '允许多选',
        "type": 'string',
        "defaultValue": 1,
        "editor": {
          "type": 'list',
          "config": {
            "list": [
              { "value": true, "title": '是' },
              { "value": false, "title": '否' }
            ]
          }
        }
      },
      "IS_DEBUG": {
        "title": '是否隐藏',
        "type": 'string',
        "defaultValue": 1,
        "editor": {
          "type": 'list',
          "config": {
            "list": [
              { "value": true, "title": '是' },
              { "value": false, "title": '否' }
            ]
          }
        }
      },
      "FILTR_LEVEL": {
        "title": '过滤层级',
        "type": 'number',
        "defaultValue": 1
      },
      "DESKTOP_ROLE": {
        "title": '是否首页显示',
        "type": 'string'
      },
      "NEW_DATA": {
        "title": '输入的时间',
        "type": 'string'
      },
      "QUERY_CONF": {
        "title": '查询脚本',
        "type": 'string',
        "inputWidth": 12,
        "isTabs": true,
        "hide": true,
        "editor": {
          "type": 'textarea'
        }
      },
      "QUERY_CFG_JSON": {
        "title": '列配置信息',
        "type": 'string',
        "isTabs": true,
        "hide": true,
        "inputWidth": 12,
        "editor": {
          "type": 'textarea'
        }
      },

      "IN_PARA_JSON": {
        "title": '传入的参数',
        "type": 'string',
        "isTabs": true,
        "hide": true,
        "inputWidth": 12,
        "editor": {
          "type": 'textarea'
        }
      },
      "JS_STR": {
        "title": 'JS脚本',
        "type": 'string',
        "isTabs": true,
        "hide": true,
        "inputWidth": 12,
        "editor": {
          "type": 'textarea'
        }
      },
      "ROWS_BTN": {
        "title": '行按钮',
        "isTabs": true,
        "hide": true,
        "type": 'string'
      },
      "HEARD_BTN": {
        "title": '表头按钮',
        "isTabs": true,
        "hide": true,
        "type": 'string'
      },

      "REMARK": {
        "title": '备注',
        "isTabs": true,
        "hide": true,
        "type": 'string',
        "inputWidth": 12,
        "editor": {
          "type": 'textarea'
        }
      }
    }
    for (const key in this.configJson) {
      this.clmNum++;
    }
    this.clmNum += 2;

    //隐藏，hide=true的字段
    this.settings.columns = this.configJson;
    this.settings.actions["add"] = true;
    this.settings.pager["perPage"] = 10;
  }

  ngOnInit() {
    setTimeout(() => {
      var table = this.container.element.nativeElement.children[0];
      var tableHeald = table.children[0]
      var tableHealdFirstRow = table.children[0].children[0]
      // console.log(this.container)
      // console.log(tableHeald)
      // console.log(tableHealdFirstRow)
      // console.log(this.template.nativeElement)
      // const text = this.renderer.createText('Hello world!');
      this.renderer.appendChild(table, this.template.nativeElement)
      // this.renderer.insertBefore(tableHeald,this.template.nativeElement,tableHealdFirstRow)
    }, 1000);
  }



  /**
   * 
   * @param event 添加事件
   */
  async onSave(event): Promise<void> {
    if (event == null) {
      this.OpenEditWindow("添加模块", {})
      return;
    }

    console.log(event.data)
    //先根据ID找到对象
    await Fun.ShowLoading();
    this.HttpHelper.Post("Query/Single", { Key: event.data.ID }).then(async (x: DtoResultObj<any>) => {
      await Fun.HideLoading()
      if (x.IsSuccess) {
        let title = "修改模块";
        if (event.data != null) {
          title = "添加模块"
        }
        this.OpenEditWindow(title, x.Data)
      }
    })



  }

  /**
   * 
   * @param title 标题
   * @param data 修改数据
   */
  OpenEditWindow(title: string, data: any) {
    this.windowService.open(QueryEditComponent, {
      windowClass: "DivWindow",
      title: title,
      context: {
        bean: data,
        inputs: this.configJson,
        buttons: [{
          name: "确定", click: (x) => {
            return new Promise(async (resolve, reject) => {
              console.log(x);
              if (window.confirm('确定要保存吗？')) {
                let postClass: DtoSaveObj<any> = new DtoSaveObj<any>();
                postClass.Data = x;
                postClass.SaveFieldList = Fun.GetBeanNameStr(x);
                await Fun.ShowLoading();

                this.HttpHelper.Post("Query/Save", postClass).then((data: DtoResultObj<any>) => {
                  Fun.HideLoading();
                  console.log(data)
                  if (data.IsSuccess) {
                    this.source.refresh()
                  }
                  else {
                    Fun.Hint(data.Msg)
                  }
                  resolve(data);
                });
              } else {
              }
            });
          }
        }]
      }
    });
  }


  /**
   * 
   * @param event 添加事件
   */
  onDelete(event): void {
    console.log(event.data)
    if (window.confirm('确定要删除吗?')) {
      Fun.ShowLoading();
      let postClass: DtoDo = new DtoDo();
      postClass.Key = event.data.ID;
      this.HttpHelper.Post("Query/Delete", postClass).then((data: DtoResult) => {
        Fun.HideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

}
