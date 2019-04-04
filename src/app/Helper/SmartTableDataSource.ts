import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
// import { getDeepFromObject } from "@Nebular/auth/helpers";
import { Observable } from "rxjs";
import { HttpHelper } from "./HttpHelper";
import { RequestOptionsArgs } from "@angular/http";
import { map } from 'rxjs/operators';
import { DtoResultObj } from "../Model/DtoRec/DtoResult";
import { Fun } from "../Config/Fun";

export class SmartTableDataSource extends LocalDataSource {
  protected conf: ServerSourceConf;
  protected lastRequestCount: number = 0;
  public setting:any={};
  constructor(
    protected httpHelper: HttpHelper,
    conf: ServerSourceConf | {} = {},
    private inKey: string = null
  ) {
    super();
    this.conf = new ServerSourceConf(conf);
    if (!this.conf.endPoint) {
      throw new Error('没有设置接口地址');
    }
    else {
      console.log("接口地址：" + this.conf.endPoint)
    }
  }

  count(): number {
    return this.lastRequestCount;
  }

  async getElements(): Promise<any> {
    await Fun.ShowLoading();
    return this.requestElements()
      .pipe(map(res => {
        //用于Query查询
        if(res.Data!=null && res.Data.rows!=null && res.Data.total!=null){
          res.Msg=res.Data.total;
          res.DataList=res.Data.rows;
        }


        this.lastRequestCount = this.extractTotalFromResponse(res);
        this.data = res.DataList;
        console.log(this.lastRequestCount);
        console.log(this.data);
        Fun.HideLoading();
        return this.data;
      })).toPromise();
  }

  /**
   * Extracts array of data from server response
   * @param res
   * @returns {any}
   */
  protected extractDataFromResponse(res: any): Array<any> {
    console.log("从服务器响应中提取数据数组");
    const rawData = res;
    // const data = !!this.conf.dataKey ? getDeepFromObject(rawData, this.conf.dataKey, []) : rawData;
    const data=res
    if (data.Data instanceof Array) {
      return data.Data;
    }
    else {
      return [];
    }
  }

  /**
   * Extracts total rows count from the server response
   * Looks for the count in the heders first, then in the response body
   * @param res
   * @returns {any}
   */
  protected extractTotalFromResponse(res: DtoResultObj<any>): number {
    console.log("从第一条提出总数");
    let total: number = 0
    if (res.Msg == null || res.Msg == "") {
      total = res.DataList.length;
    } else {
      total = parseInt(res.Msg);
    }
    return total
  }

  protected requestElements(): Observable<any> {
    console.log("请求所有数据");

    let allPar = this.createRequestOptions();
    let par: URLSearchParams = allPar.params as URLSearchParams
    console.log(par)
    let postBean: any = {};

    
    postBean.sort=par.get("_sort");
    postBean.order=par.get("_order");
    postBean.rows=par.get("_limit");
    postBean.page=par.get("_page");
    par.forEach((vars, key) => {
      console.log(key)
      console.log(vars)
      // if (key == "_sort") postBean.sort = [{ Key: vars[0], Value: par.get("_order")[0], Type: "" }]; //排序字段
      if (key.indexOf('_like') > 0) {
        let keyName = key.substr(0, key.indexOf('_like'));
        if(postBean.WhereList==null){
          postBean.WhereList=[]
        }
        var column=this.setting.columns[keyName];
        postBean.WhereList.push({ ObjFiled: keyName, Value: par.get(key), OpType: "like",FieldType: column["type"],FieldName:keyName}); //排序字段
      }
    })
    postBean.Code = this.inKey
    if(postBean.rows==null)postBean.rows=1;
    if(postBean.page==null)postBean.page=10;
    return this.httpHelper.PostToObservable(this.conf.endPoint, postBean).pipe(x => {
      return x
    })
  }

  protected createRequestOptions(): RequestOptionsArgs {
    console.log("获取头文件");
    let requestOptions: RequestOptionsArgs = {};
    requestOptions.params = new URLSearchParams();

    requestOptions = this.addSortRequestOptions(requestOptions);
    requestOptions = this.addFilterRequestOptions(requestOptions);
    return this.addPagerRequestOptions(requestOptions);
  }

  protected addSortRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    console.log("添加排序请求参数");

    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.sortConf) {
      this.sortConf.forEach((fieldConf) => {
        searchParams.set(this.conf.sortFieldKey, fieldConf.field);
        searchParams.set(this.conf.sortDirKey, fieldConf.direction.toUpperCase());
      });
    }

    return requestOptions;
  }

  protected addFilterRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    console.log("添加过虑请求参数");

    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.filterConf.filters) {
      this.filterConf.filters.forEach((fieldConf: any) => {
        if (fieldConf['search']) {
          searchParams.set(this.conf.filterFieldKey.replace('#field#', fieldConf['field']), fieldConf['search']);
        }
      });
    }

    return requestOptions;
  }

  protected addPagerRequestOptions(requestOptions: RequestOptionsArgs): RequestOptionsArgs {
    console.log("添加其它请求参数");

    const searchParams: URLSearchParams = <URLSearchParams>requestOptions.params;

    if (this.pagingConf && this.pagingConf['page'] && this.pagingConf['perPage']) {
      searchParams.set(this.conf.pagerPageKey, this.pagingConf['page']);
      searchParams.set(this.conf.pagerLimitKey, this.pagingConf['perPage']);
    }

    return requestOptions;
  }



    /**
   * 获取默认的表参数
   */
  public static getDefaultSetting() {
    return {
      noDataMessage: "无数据",
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
      },
      actions: {
        columnTitle: "操作",
        add:true,
        position:'left'
        // position:"right"
      },
      columns: {},
      pager: {
        display: true,
        perPage: 10
      }
    }
  }
  /**
   * 删除有Hide为true的项
   * @param objJson 
   */
  public static ReMoveHideItem(objJson) {
    console.log("删除有Hide为true的项")
    let reJson = {}
    for (var item in objJson) {
      if (objJson[item]["hide"] == null || objJson[item]["hide"] != true) {
        reJson[item] = objJson[item]
      }
    }
    return reJson
  }
}


export class SmartTableSetting{

  mode:string= 'inline';
  selectMode:string= 'single'; // single|multi
  hideHeader:boolean= false;
  hideSubHeader: boolean=false;
  actions:any= {
    columnTitle: 'Actions', 
    add: true,
    edit: true,
    delete: true,
    custom: [],
    position: 'left', // left|right
  };
  filter:any= {
    inputClass: '',
  };
  edit:any={
    inputClass: '',
    editButtonContent: 'Edit',
    saveButtonContent: 'Update',
    cancelButtonContent: 'Cancel',
    confirmSave: false,
  };
  add: {
    inputClass: '',
    addButtonContent: 'Add New',
    createButtonContent: 'Create',
    cancelButtonContent: 'Cancel',
    confirmCreate: false,
  };
  delete: {
    deleteButtonContent: 'Delete',
    confirmDelete: false,
  };
  attr: {
    id: '',
    class: '',
  };
  noDataMessage: 'No data found';
  columns: {}
  pager: {
    display: true,
    perPage: 10,
  };
  rowClassFunction: () => ""

  
}

