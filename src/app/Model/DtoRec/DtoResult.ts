export class DtoResult {
    /**
     * 是否成功
     */
    IsSuccess:boolean;
    /**
     * 返回代码
     */
    Code:string;
    /**
     * 返回描述
     */
    Msg:string;
}

export class DtoResultObj<T> extends DtoResult {


    /**
     * 数据
     */
    Data:T;
    /**
     * 数据列表
     */
    DataList:T[];
}