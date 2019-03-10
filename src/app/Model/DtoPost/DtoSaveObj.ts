export class DtoSaveObj<T> {
    /**
     * 保存的对像
     */
    Data:T
    /**
     * 保存的字段
     */
    SaveFieldList:Array<string>
    /**
     * 需要忽略的字段
     */
    IgnoreFieldList:Array<string>

    /**
     * 更新条件,如果为空.则以主键为更新条件
     */
    WhereList:Array<string>
}