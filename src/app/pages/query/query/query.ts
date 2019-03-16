import { Component, OnInit, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableDataSource } from '../../../Helper/SmartTableDataSource';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { NbWindowService } from '@nebular/theme';
import { DtoResultObj } from '../../../Model/DtoRec/DtoResult';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { Variables } from '../../../Config/Variables';
import { Fun } from '../../../Config/Fun';
import { DtoDo } from '../../../Model/DtoPost/DtoDo';
import { QueryEditComponent } from '../../../components/query-edit/query-edit.component';
import { DtoSaveObj } from '../../../Model/DtoPost/DtoSaveObj';

@Component({
  selector: 'query',
  templateUrl: './query.html',
  styleUrls: ['./query.scss']
})
export class QueryQueryComponent implements OnInit {
  @ViewChild('samrtTable', { read: ViewContainerRef }) container: ViewContainerRef;

  source: LocalDataSource;
  queryEnt: any = {
    REMARK: "　"
  };
  /**
   * 表头按钮
   */
  headBtnSet: Array<any> = [];
  /**
   * 行按钮
   */
  rowBtnSet: Array<any> = [];

  LoadSetting: boolean = false;
  /**
   * 用于绑定table的设置
   */
  settings: any = SmartTableDataSource.getDefaultSetting();;
  /**
   * 读取配置文件的设置
   */
  configJson: any = {}
  selectedArr = []
  code: any;
  thisUrl: string = ""
  constructor(
    private routerIonfo: ActivatedRoute,
    private HttpHelper: HttpHelper,
    private windowService: NbWindowService,
  ) {
  }
  ngOnInit() {
    this.CheckUrl();
  }


  /** 用于检测URL地址是否改变，如已经变则刷新该页面 */
  CheckUrl() {

    setTimeout(() => {
      if (window.location.href.indexOf("/pages/query/query?") > -1) {
        if (window.location.href != this.thisUrl) {
          this.thisUrl = window.location.href
          this.code= this.routerIonfo.snapshot.queryParams["code"];
          this.LoadData().then(x => {
            this.CheckUrl()
          })
        }
        else {
          this.CheckUrl()
        }
      }
    }, 1000)
  }
  LoadData() {
    let postEnt={ Key: this.code }
    return this.HttpHelper.Post("query/GetSingleQuery", postEnt).then((data: DtoResultObj<any>) => {
      if (data.IsSuccess) {
        this.queryEnt = data.Data
        //隐藏，hide=true的字段
        let t: any = {}
        //设置列配置
        eval("t=" + this.queryEnt.QUERY_CFG_JSON)
        this.configJson = t
        //设置表头按钮配置
        eval("t=" + this.queryEnt.HEARD_BTN)
        this.headBtnSet = t
        //读取行按钮
        try {
          eval("t=" + this.queryEnt.ROWS_BTN)
          this.rowBtnSet = t
        } catch (error) {

        }
        if (this.rowBtnSet == null) this.rowBtnSet = []

        let tempCol = SmartTableDataSource.ReMoveHideItem(this.configJson);
        // for (const item in tempCol) {
        //   if (tempCol[item]["renderComponent"] == "SmartTableFormatValuePage") {
        //     tempCol[item]["renderComponent"] = SmartTableFormatValuePage
        //   }
        // }
        this.settings.columns = tempCol
        this.LoadSetting = true
        //配置是否有筛选框
        if (this.queryEnt.SHOW_CHECKBOX != 1) {
          this.settings.selectMode = "single"
        }

        if (this.rowBtnSet.length > 1) {
          this.settings.actions.edit = true
          this.settings.edit.editButtonContent = '<i class="' + this.rowBtnSet[0].class + '"></i>'
        }
        if (this.rowBtnSet.length > 2) {
          this.settings.actions.edit = true
          this.settings.delete.deleteButtonContent = '<i class="' + this.rowBtnSet[1].class + '"></i>'
        }

        let smartTableCofnig: ServerSourceConf = new ServerSourceConf();
        smartTableCofnig.endPoint = 'Query/GetBindListData';
        smartTableCofnig.dataKey = "code"
        this.source = new SmartTableDataSource(this.HttpHelper, smartTableCofnig,this.code);

      }

    }, (x) => {
      console.log(x)
    })
  }

  userRowSelect(event) {
    this.selectedArr = event.selected
    console.log(this.selectedArr)
  }

  /**
   * 表头按钮事件
   * @param event 
   */
  HeadBtnClick(nowThis, event) {
    if (event != null) {
      eval(event)
    }
  }

  /**导出Excel */
  onExportXls() {

    let postBean: any = {};
    postBean.Code = this.code
    this.HttpHelper.Post("Query/DownFile", postBean).then((x: DtoResultObj<any>) => {
      console.log(x)
      // Blob转化为链接
      var link = document.createElement("a");
      link.setAttribute("href", Variables.ImgUrl + x.Msg);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    // console.log(this.source.getFilter());
    // console.log(this.source.getSort());
  }


  /**
   * 删除事件
   * @param event 添加事件
   */
  onDelete(event): void {

    if (this.rowBtnSet.length > 1) {
      this.DeleteApi(this.rowBtnSet[1].apiUrl, event.data.ID, this.rowBtnSet[1].confirmTip)
    }

  }


  onSave(nowThis, event) {
    if (this.rowBtnSet.length > 0) {
      // this.Add(this.rowBtnSet[0].apiUrl, this.rowBtnSet[0].openModal, event.data, this.rowBtnSet[0].readUrl)
    }
  }
  /**
   * 删除
   * @param apiUrl 
   * @param Key 
   * @param confirmTip 
   */
  DeleteApi(apiUrl, Key, confirmTip) {
    if (window.confirm(confirmTip)) {
      Fun.ShowLoading();
      let postClass: DtoDo = new DtoDo();
      postClass.Key = Key;
      this.HttpHelper.Post(apiUrl, postClass).then((data: DtoResultObj<any>) => {
        Fun.HideLoading()
        if (data.IsSuccess) {
          this.source.refresh()
        }
      });
    }
  }

  Exec(apiUrl, Key, confirmTip) {
    let allKeyList = []
    this.selectedArr.forEach(element => {
      allKeyList.push(element[Key])
    });
    this.DeleteApi(apiUrl, allKeyList.join(","), confirmTip)
  }

  /**
   * 
   * @param apiUrl 保存API
   * @param openModal 弹出对话框的组件
   * @param defaultData 默认数据
   * @param readUrl 读取默认数据的API
   */

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
   * 获取初始值
   * @param defaultData 行选择的值
   * @param readUrl 加载的URL
   */
  GetBean(defaultData = null, readUrl = null): Promise<any> {
    if (readUrl != null) {
      return this.HttpHelper.Post(readUrl, { Key: defaultData.ID })
    }
    else {
      if (defaultData == null) defaultData = {}
      return new Promise((resolve, rejeact) => { resolve({ "IsSuccess": true, "Data": defaultData }) });
    }
  }


  ReLoad() {
    this.source.refresh()
  }
}