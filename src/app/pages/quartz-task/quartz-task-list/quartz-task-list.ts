import { Component, OnInit, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { SmartTableDataSource } from '../../../Helper/SmartTableDataSource';
import { Fun } from '../../../Config/Fun';
import { DtoResult, DtoResultObj } from '../../../Model/DtoRec/DtoResult';
import { NbWindowService } from '@nebular/theme';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { DtoSaveObj } from '../../../Model/DtoPost/DtoSaveObj';
import { DtoDo } from '../../../Model/DtoPost/DtoDo';
import { EditModelComponent } from '../../../components/edit-model/edit-model.component';


@Component({
  selector: 'quartz-task-list',
  templateUrl: './quartz-task-list.html',
  styleUrls: ['./quartz-task-list.scss']
})
export class QuartzTaskListPage implements OnInit {
  i18n = 'quartztask'


  @ViewChild('samrtTable', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('btnHead') template;
  
  source: LocalDataSource = new LocalDataSource();
  /** 静态方法，获取默认配置 */
  settings: any = SmartTableDataSource.getDefaultSetting();
  configJson: any = {}
  /** 显示的列数 */
  clmNum: number = 0

  IsStart:boolean;
  constructor(
    private HttpHelper: HttpHelper,
    private windowService: NbWindowService,
    private renderer: Renderer2
  ) {
    let smartTableCofnig: ServerSourceConf = new ServerSourceConf();
    smartTableCofnig.endPoint = 'QuartzTask/List';
    smartTableCofnig.pagerLimitKey = ""
    this.source = new SmartTableDataSource(this.HttpHelper, smartTableCofnig);
    this.configJson = {
      "KeyName": {
        "title": '名称',
        "type": 'string',
      },
      "KeyGroup": {
        "title": '组名称',
        "type": 'string'
      },
      "JobDataListStr": {
        "title": '传入的参数',
        "type": 'string'
      },
      "CalendarName": {
        "title": '日历名称',
        "type": 'string',
      },
      "Description": {
        "title": '描述',
        "type": 'string',
      },
      "EndTime": {
        "title": '结束时间',
        "type": 'string',
      },
      "FinalFireTimeUtc": {
        "title": '最后一次执行时间',
        "type": 'string',
      },
      "NextFireTime": {
        "title": '下次执行时间',
        "type": 'string',
      },
      "Priority": {
        "title": '执行级别',
        "type": 'string',
      },
      "StartTimeUtc": {
        "title": '开始执行时间',
        "type": 'string',
      }
    }
    for (const key in this.configJson) {
      this.clmNum++;
    }
    this.clmNum += 2;

    //隐藏，hide=true的字段
    this.settings.columns = this.configJson;
    this.settings.actions["add"] = true;
    this.settings.pager["perPage"]= 10;
  }

  ngOnInit() {
    setTimeout(() => {
      var table = this.container.element.nativeElement.children[0];
      this.renderer.appendChild(table, this.template.nativeElement)
    }, 1000);
  }

  /** 检测是否启动 */
  async ReLoad(){
    //先根据ID找到对象
    this.HttpHelper.Post("QuartzTask/IsStarted", null).then(async (x: DtoResultObj<any>) => {
      if (x.IsSuccess) {
        this.IsStart=x.Data;
        if(this.IsStart){
          this.source.refresh()
        }
      }
      else{
        this.IsStart=false;
        Fun.Hint(x.Msg)
      }
    })
  }


  /**
   * 
   * @param event 开始事件
   */
  async onStart(){
    //先根据ID找到对象
    await Fun.ShowLoading();
    this.HttpHelper.Post("QuartzTask/Start", null).then(async (x: DtoResultObj<any>) => {
      await Fun.HideLoading()
      if (x.IsSuccess) {
        Fun.Hint("启动成功")

        this.ReLoad();
      }
      else{
        Fun.Hint(x.Msg)
      }
    })
  }

  async Stop(){
    //先根据ID找到对象
    await Fun.ShowLoading();
    this.HttpHelper.Post("QuartzTask/Stop", null).then(async (x: DtoResultObj<any>) => {
      await Fun.HideLoading()
      if (x.IsSuccess) {
        Fun.Hint("停止成功")
        this.ReLoad();
      }
      else{
        Fun.Hint(x.Msg)
      }
    })
  }
  

  /**
   * 
   * @param title 标题
   * @param data 修改数据
   */
  OpenEditWindow(title: string, data: any) {
    this.windowService.open(EditModelComponent, {
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
      this.HttpHelper.Post("QuartzTask/RemoveJob", postClass).then((data: DtoResult) => {
        Fun.HideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }



}
