import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SmartTableData } from '../../../@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableHelper } from '../../../Helper/SmartTableHelper';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { SmartTableDataSource } from '../../../Helper/SmartTableDataSource';
import { Fun } from '../../../Config/Fun';
import { DtoResult } from '../../../Model/DtoRec/DtoResult';

@Component({
  selector: 'query',
  templateUrl: './query.html',
  styleUrls: ['./query.scss']
})
export class QueryQueryComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  settings: any = SmartTableHelper.getDefaultSetting();

  constructor(
    private service: SmartTableData,
    private HttpHelper: HttpHelper,
    http: Http,
  ) {
    this.source = new SmartTableDataSource(this.HttpHelper, { endPoint: 'module/list' });
    // this.settings.mode="inline"
    this.settings.columns = {
      ID: {
        title: '模块ID',
        type: 'number',
        editable: false,
      },
      NAME: {
        title: '模块名',
        type: 'string',
        editable:true
      },
      PARENT_ID: {
        title: '上级ID',
        type: 'number',
      },
      LOCATION: {
        title: '地址',
        type: 'string',
      },
      CODE: {
        title: '代码',
        type: 'string',
      },
      IS_DEBUG: {
        title: '是否调试',
        type: 'number',
        editor: {
          type: 'list',
          config: {
            list: [
              { value: '1', title: '是' }, 
              { value: '0', title: '否' }, 
            ],
          },
        },
      },
      IS_HIDE: {
        title: '是否隐藏',
        type: 'number',
      },
      SHOW_ORDER: {
        title: '排序号',
        type: 'number',
      },
      DESCRIPTION: {
        title: '描述',
        type: 'string',
        inputWidth: 12,
        editor: {
          type: 'textarea'
        }
      },
      IMAGE_URL: {
        title: '图片地址',
        type: 'string',
      },
      DESKTOP_ROLE: {
        title: '是否首页显示',
        type: 'string',
      },
      W: {
        title: '宽',
        type: 'number',
      },
      H: {
        title: '高',
        type: 'number',
      }
    }
  }

  ngOnInit() {

  }

  /**
   * 
   * @param event 添加事件
   */
  onSave(event): void {
    console.log(event.data)
    let title="修改模块";
    if (event.data != null) {
      title= "添加模块"
    }

    Fun.Confirm("title",event.data,()=>{
      let postClass: any = {};
      postClass.Data = event.data;
      this.HttpHelper.Post("module/save", postClass).then((data: DtoResult) => {
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    },()=>{

    },"确定","取消")
  }

  /**
   * 
   * @param event 添加事件
   */
  onDelete(event): void {
    console.log(event.data)
    if (window.confirm('确定要删除吗?')) {
      Fun.ShowLoading();
      let postClass: any;
      postClass.Key = event.data.ID;
      this.HttpHelper.Post("module/delete", postClass).then((data: DtoResult) => {
        Fun.HideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

}
