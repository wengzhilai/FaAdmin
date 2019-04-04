import { Component, OnInit, ViewChild, ViewContainerRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartTableDataSource } from '../../../Helper/SmartTableDataSource';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { NbWindowService } from '@nebular/theme';
import { DtoResultObj } from '../../../Model/DtoRec/DtoResult';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { Variables } from '../../../Config/Variables';
import { Fun } from '../../../Config/Fun';
import { DtoDo } from '../../../Model/DtoPost/DtoDo';
import { DtoSaveObj } from '../../../Model/DtoPost/DtoSaveObj';
import { EditModelComponent } from '../../../components/edit-model/edit-model.component';
import { RoleEditComponent } from '../../../components/role-edit/role-edit.component';
import { QueryEditComponent } from '../../../components/query-edit/query-edit.component';
import { TableEditComponent } from '../../../components/table-edit/table-edit.component'

@Component({
  selector: 'Equipment_List',
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class EquipmentListComponent implements OnInit {
  @ViewChild('samrtTable', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('btnHead') template;
  source: any;
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
  //用于加载设置，如果为 false，则不显示Table,
  LoadSetting: boolean = false;
  /**
   * 用于绑定table的设置
   */
  settings: any = SmartTableDataSource.getDefaultSetting();;
  /**
   * 读取配置文件的设置
   */
  configJson: any = {}
  /** 显示的列数 */
  clmNum: number = 0

  selectedArr = []
  code: any;
  thisUrl: string = ""
  constructor(
    private routerIonfo: ActivatedRoute,
    private HttpHelper: HttpHelper,
    private windowService: NbWindowService,
    private renderer: Renderer2,
  ) {
  }
  ngOnInit() {
    this.routerIonfo.queryParams.subscribe(params => {
      this.code = params['id'];
      this.LoadData();
    });
  }

  LoadData() {

    this.LoadSetting = false;
    let postEnt = { Key: this.code }
    return this.HttpHelper.Post("Equipment/GetConfig", postEnt).then((data: DtoResultObj<any>) => {
      if (data.IsSuccess) {
        //显示table
        this.LoadSetting = true;

        this.configJson={};
        var cfgJsonList:Array<any>=data.Data.ColumnsList;
        this.clmNum=0;
        cfgJsonList.forEach((element:any) => {
          console.log(element);
          if (element.hasOwnProperty("ColumnName")) {
            this.configJson[element["ColumnName"]]=element;
            this.clmNum++;
          }
        });
        this.clmNum += 2;
        console.log(this.configJson);
        this.settings.columns = this.configJson

        let smartTableCofnig: ServerSourceConf = new ServerSourceConf();
        smartTableCofnig.endPoint = 'Equipment/GetConfigAndData';
        smartTableCofnig.dataKey = "code"

        this.source = new SmartTableDataSource(this.HttpHelper, smartTableCofnig, this.code);
        this.source.setting = this.settings;
        // this.ReLoad()

      }

    }, (x) => {
      console.log(x)
    })





    //隐藏table，在显示的时候，才会刷新列数据

    // this.AddHeadBtn()
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
  // Add(){
  //   this.OpenEditWindow("添加模块", {})
  // }
  async Add(apiUrl, openModal: any = null, defaultData = null, readUrl = null) {
    console.log(apiUrl)
    console.log(defaultData)
    console.log(readUrl)
    // return;
    await Fun.ShowLoading();
    this.GetBean(defaultData, readUrl).then((x: DtoResultObj<any>) => {
      Fun.HideLoading();
      console.log(x);
      if (x == null || !x.IsSuccess) {
        console.log("获取取初始值失败")
        //如果获取取初始值失败，则用列表数据
        x.Data = defaultData;
      }
      console.log("获取取初始值")
      console.log(x.Data)

      let title = "修改"
      if (defaultData != null) {
        title = "添加"
      }
      this.windowService.open(this.GetComponents(openModal), {
        windowClass: "DivWindow",
        title: title,
        context: {
          bean: x.Data,
          inputs: this.configJson,
          buttons: [{
            name: "确定", click: (x) => {
              return new Promise(async (resolve, reject) => {
                console.log(x);
                if (window.confirm('确定要保存吗？')) {
                  let postClass: any = {};
                  postClass.DataStr = JSON.stringify(x);
                  postClass.Id=(defaultData==null)?'0':defaultData.ID;
                  postClass.TypeId=this.code
                  await Fun.ShowLoading();

                  this.HttpHelper.Post(apiUrl, postClass).then((data: DtoResultObj<any>) => {
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

    })

  }

  /**导出Excel */
  async onExportXls() {


    var link = document.createElement("a");
    link.setAttribute("href", Variables.Api + "Query/DownFile?code=" + this.code);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
      this.Add("Equipment/SaveEquiment","EditModelComponent", event.data, "Equipment/SingleEquiment")
  }
  /**
   * 删除
   * @param apiUrl 
   * @param Key 
   * @param confirmTip 
   */
  async DeleteApi(apiUrl, Key, confirmTip) {
    if (window.confirm(confirmTip)) {
      await Fun.ShowLoading();
      let postClass: DtoDo = new DtoDo();
      postClass.Key = Key;
      this.HttpHelper.Post(apiUrl, postClass).then((data: DtoResultObj<any>) => {
        Fun.HideLoading()
        console.log(data)
        if (data.IsSuccess) {
          this.source.refresh()
        }
        else {
          Fun.Hint(data.Msg)
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
   * 获取初始值
   * @param defaultData 行选择的值
   * @param readUrl 加载的URL
   */
  GetBean(defaultData = null, readUrl = null): Promise<any> {
    if (readUrl != null && defaultData != null && defaultData.ID != null) {

      return this.HttpHelper.Post(readUrl, { Id: defaultData.ID,TypeId:this.code })
    }
    else {
      if (defaultData == null) defaultData = {}
      return new Promise((resolve, rejeact) => { resolve({ "IsSuccess": true, "Data": defaultData }) });
    }
  }


  ReLoad() {
    this.source.refresh()
  }


  GetComponents(name) {
    switch (name) {
      case "RoleEditComponent":
        return RoleEditComponent
      case "QueryEditComponent":
        return QueryEditComponent;
      case "TableEditComponent":
        return TableEditComponent;
      default:
        return EditModelComponent
    }
  }
}