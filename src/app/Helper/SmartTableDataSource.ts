import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { getDeepFromObject } from "../Lib/Nebular/auth/helpers";
import { Observable } from "rxjs";
import { HttpHelper } from "./HttpHelper";
import { Fun } from "../Config/Fun";
import { RequestOptionsArgs } from "@angular/http";
import { map } from 'rxjs/operators';
import { DtoResult, DtoResultObj } from "../Model/DtoRec/DtoResult";

export class SmartTableDataSource extends LocalDataSource {
  protected conf: ServerSourceConf;
  protected lastRequestCount: number = 0;
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

  getElements(): Promise<any> {

    return this.requestElements()
    .pipe(map(res => {
      this.lastRequestCount = this.extractTotalFromResponse(res);
      this.data=res.DataList;
      console.log(this.lastRequestCount);
      console.log(this.data);
      return this.data;
    })).toPromise();
  }
  /**
   * 获取默认的表参数
   */
  static getDefaultSetting() {
    return {
      noDataMessage: "无数据",
      mode: "external",
      selectMode: "multi",
      hideSubHeader: true, //隐藏默认的过滤行
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
        // position:"right"
      },
      columns: {}
    }
  }
  /**
   * 删除有Hide为true的项
   * @param objJson 
   */
  static ReMoveHideItem(objJson) {
    console.log("删除有Hide为true的项")
    let reJson = {}
    for (var item in objJson) {
      if (objJson[item]["hide"] == null || objJson[item]["hide"] != true) {
        reJson[item] = objJson[item]
      }
    }
    return reJson
  }
  /**
   * Extracts array of data from server response
   * @param res
   * @returns {any}
   */
  protected extractDataFromResponse(res: any): Array<any> {
    console.log("从服务器响应中提取数据数组");
    const rawData = res;
    const data = !!this.conf.dataKey ? getDeepFromObject(rawData, this.conf.dataKey, []) : rawData;

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
    let total:number=0
    if(res.Msg==null || res.Msg==""){
      total=res.DataList.length;
    }else{
      total=parseInt(res.Msg);
    }
    return total
  }

  protected requestElements(): Observable<any> {
    console.log("请求所有数据");

    let allPar = this.createRequestOptions();
    let par: URLSearchParams = allPar.params as URLSearchParams
    let postBean: any = {};
    par.forEach((vars, key) => {
      if (key == "_limit") postBean.PageSize = parseInt(vars[0]);
      if (key == "_page") postBean.PageIndex = parseInt(vars[0]);
      if (key == "_sort") postBean.OrderBy = [{ Key: vars[0], Value: par.get("_order")[0], Type: "" }]; //排序字段
      if (key.indexOf('_like') > 0) {
        let keyName = key.substr(0, key.indexOf('_like'));
        postBean.SearchKey.push({ Key: keyName, Value: par.get(key)[0], Type: "like" }); //排序字段
      }
    })
    postBean.Key = this.inKey
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
}

