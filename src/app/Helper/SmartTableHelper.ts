export class SmartTableHelper {
    /**
     * 获取默认的表参数
     */
    public static getDefaultSetting() {
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

    
}