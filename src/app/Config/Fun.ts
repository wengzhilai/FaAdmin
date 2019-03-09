import { LoadingController, ToastController, Platform, AlertController, ModalController } from "@ionic/angular";
import { TranslateService } from "../Lib/ngx-translate/public_api";
import { FormGroup, FormControl } from "@angular/forms";
import { KeyValuePair } from "../Model/KeyValuePair";
import { ImgUrlPipe } from "../pipes/ImgUrl";
import { Variables } from "./Variables";
import { EditModelComponent } from "../components/edit-model/edit-model.component";

export class Fun {


    public static loadingCtrl: LoadingController;
    public static toastCtrl: ToastController;
    public static plt: Platform;
    public static alertCtrl: AlertController;
    public static translate: TranslateService;
    public static loader: any;
    public static modalCtrl: ModalController;


    public static Init(_loadingCtrl: LoadingController,
        _toastCtrl: ToastController,
        _plt: Platform,
        _alertCtrl: AlertController,
        _translate: TranslateService,
        _modalCtrl: ModalController,
    ) {
        this.loadingCtrl = _loadingCtrl;
        this.toastCtrl = _toastCtrl;
        this.plt = _plt;
        this.alertCtrl = _alertCtrl;
        this.translate = _translate;
        this.modalCtrl = _modalCtrl;
    }

    /**
     * 是否面桌应用
     */
    public static IsDesktop(): boolean {
        let allPlat = this.plt.platforms();
        console.log(allPlat);
        let reObj = false;
        for (var i = 0; i < allPlat.length; i++) {
            if ("desktop" == allPlat[i].toLocaleLowerCase()) {
                reObj = true;
            }
        }
        return reObj;
    }



    /**
     * 获取语言
     * @param key 
     */
    public static LanguageStr(key: string | Array<string>) {
        if (typeof key == 'string') {
            return this.translate.instant(key);
        }
        else if (typeof key == 'object') {
            let tmpResArr = this.translate.instant(key);
            let reArr = [];
            key.forEach(element => {
                reArr.push(tmpResArr[element])
            });
            return reArr.join(" ");
        }
    }
    /**
     * 获取地址栏的参数
     * 
     * @param {any} name 
     * @returns 
     * @memberof CommonService
     */
    public static GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }



    /**
     * 记录错误信息
     * 
     * @param {any} error 
     * @memberof CommonService
     */
    public static async  ShowError(error) {
        this.HideLoading();
        //表示没有权限访问
        if (error.status == 401) {
            let toast = await this.toastCtrl.create({
                message: error.body,
                duration: 2000,
                position: 'bottom'
            });
            toast.present();
        } else {
            let toast = await this.toastCtrl.create({
                message: error,
                duration: 2000,
                position: 'bottom'
            });
            toast.present();
        }
    };

    /**
     * 显示加载
     * 
     * @param {string} [msg='{{"public.refreshingText"|translate}}'] 
     * @memberof CommonService
     */
    public static async ShowLoading(msg = this.translate.instant("public.Loading")) {
        if (this.loader == null) {
            this.loader = await this.loadingCtrl.create({
                message: msg,
                duration: 10000
            });
            await this.loader.present();
        }
    };
    /**
     * 显示提示，并在2秒后自动关闭
     * 
     * @param {string} msg 
     * @memberof CommonService
     */
    public static async showLongToast(msg: string, duration = 2000, closeButtonText = '') {

        let toast = await this.toastCtrl.create({
            message: msg.replace("\\r\\n", "<br />"),
            duration: 2000,
        });

        if (closeButtonText != null && closeButtonText != "") {
            toast = await this.toastCtrl.create({
                message: msg.replace("\\r\\n", "<br />"),
                showCloseButton: true,
                closeButtonText: closeButtonText
            });
        }

        toast.present();
    }

    /**
     * 隐藏加载
     * 
     * @memberof CommonService
     */
    public static HideLoading() {
        if (this.loader != null) {
            this.loader.dismiss();
            this.loader = null;
        }
    }



    /**
     * 格式化日期
     * 
     * @param {Date} dt 
     * @param {string} fmt 
     * @returns 
     * @memberof CommonService
     */
    public static DateFormat(dt: Date, fmt: string) {
        var o = {
            "M+": dt.getMonth() + 1,                 //月份
            "d+": dt.getDate(),                    //日
            "h+": dt.getHours(),                   //小时
            "m+": dt.getMinutes(),                 //分
            "s+": dt.getSeconds(),                 //秒
            "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
            "S": dt.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    /**
     * 格式化日期
     * 
     * @param {string} dtStr 
     * @param {string} fmt 
     * @returns 
     * @memberof CommonService
     */
    // DateStrFormat(dtStr: string, fmt: string) {
    //     return new DataStrToStringPipe().transform(dtStr, fmt)
    // }

    /**
     * 拨打电话
     * 
     * @param {any} mobilePhone 
     * @memberof CommonService
     */
    callPhone(mobilePhone) {
        window.location.href = "tel:" + mobilePhone;
    }

    /**
     * 获取类的所有属性
     * 
     * @param {any} bean 传入的类
     * @returns 返回类的所有字段的字符串，以逗号分隔
     * @memberof CommonService
     */
    GetBeanNameStr(bean) {
        var tmpArr = [];
        for (var item in bean) {
            var objV = bean[item];
            if (typeof (objV) != "string" || objV.indexOf('/Date(') != 0) {
                tmpArr.push(item);
            }
        }

        return tmpArr;
    }


    /**
     * 提示信息
     * 
     * @param {string} msg 
     * @param {string} [title=null] 
     * @returns 
     * @memberof CommonService
     */
    public static async Hint(msg: string, title: string = null) {
        if (msg == null || msg == '') {
            return;
        }
        if (title == null || title == '') {
            title = this.translate.instant("public.title");
        }
        try {
            let alert = await this.alertCtrl.create({
                header: title.replace(/\r/g, "<br />"),
                subHeader: msg.replace(/\\r\\n/g, "<br />"),
                buttons: [this.translate.instant("public.Okay")]
            });
            await alert.present();
        } catch (e) {
            let alert = await this.alertCtrl.create({
                header: title,
                subHeader: msg,
                buttons: [this.translate.instant("public.Okay")]
            });
            await alert.present();
        }
    }



    /**
     * 处理验证信息
     * 
     * @param {FormGroup} userForm 
     * @param {any} validationMessages 
     * @returns 
     * @memberof CommonService
     */
    public static FormValidMsg(userForm: FormGroup, validationMessages) {
        if (validationMessages == null) validationMessages = {};
        var formErrors: any = {};
        if (!userForm) {
            return;
        }
        let defautMsg = {
            'required': () => {
                return this.translate.instant("public.Not_null");
            },
            'minlength': (ent: any) => {
                return this.translate.instant("public.mini_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
            },
            'maxlength': (ent: any) => {
                return this.translate.instant("public.max_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
            }
        };
        for (const field in userForm.value) {
            const control = userForm.get(field);
            if (!control.valid) {
                // 默认名称为字段
                let keyName = field;
                // 错误的信息
                let keyMesg = "";

                if (typeof (validationMessages) == "object") {
                    //是否配置了中文名称
                    if (validationMessages[field]['aliasName'] != null) {
                        keyName = validationMessages[field]['aliasName'];
                    }
                }
                else if (typeof (validationMessages) == "string") {
                    keyName = this.LanguageStr(validationMessages + "." + field)
                }
                console.log(control.errors)

                //所有错误
                for (const key in control.errors) {
                    console.log(key)
                    //判断是否有配置
                    if (typeof (validationMessages) == "object") {
                        const messages = validationMessages[field];
                        //是否配置了错误信息
                        if (messages[key] != null) {
                            keyMesg += messages[key];
                        }
                        else {
                            if (defautMsg[key] != null) {
                                keyMesg += defautMsg[key](control.errors[key]);
                            }
                            else {
                                keyMesg += key;
                            }
                        }
                    }
                    else {
                        if (defautMsg[key] != null) {
                            keyMesg += defautMsg[key](control.errors[key]);
                        }
                        else {
                            keyMesg += key;
                        }
                    }


                }
                formErrors[keyName] = keyMesg;
            }
        }

        let errMsg = "";
        for (const field in formErrors) {
            errMsg += "" + this.translate.instant(field) + "：" + formErrors[field] + "、"
        }
        return { "ErrorItemArr": formErrors, "ErrorMessage": errMsg };
    }

    public static FormErrMsg(control: any) {
        if (!control) {
            return;
        }
        let defautMsg = {
            'required': () => {
                return this.translate.instant("public.Not_null");
            },
            'minlength': (ent: any) => {
                return this.translate.instant("public.mini_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
            },
            'maxlength': (ent: any) => {
                return this.translate.instant("public.max_string", { minNum: ent.requiredLength, currNum: ent.actualLength });
            }
        };
        let keyMesg = "";

        if (!control.valid) {
            //所有错误
            for (const key in control.errors) {
                //判断是否有配置
                if (defautMsg[key] != null) {
                    keyMesg += defautMsg[key](control.errors[key]);
                }
                else {
                    keyMesg += key;
                }
            }
        }

        return keyMesg
    }

    /**
     * 类传成数据
     * @param bean 需要转换的类
     * @param jsonOjb json格式，里机转换的字段
     */
    public static ClassToKeyValuePair(bean, jsonOjb = {}) {
        console.log("类传成数据")
        console.log(bean)
        console.log(jsonOjb)
        var tmpArr: Array<KeyValuePair> = new Array<KeyValuePair>();
        let forBean = jsonOjb;
        if (jsonOjb == null || jsonOjb == {}) {
            forBean = bean;
        }
        for (var item in forBean) {
            if (item in bean) {
                var objV: KeyValuePair = new KeyValuePair();
                objV.Key = item;
                objV.Value = (bean[item] == null) ? '' : bean[item];
                // objV.Type = jsonOjb[item];
                tmpArr.push(objV)
            }
        }
        return tmpArr;
    }


    /**
     * 检测文件名是否是图片
     * @param name 文件名
     */
    public static IsPicName(name) {
        var pattern = new RegExp(/^.*(.jpg|.png|.gif)$/);
        if (pattern.exec(name)) {
            return true;
        }
        return false;
    }

    public static GetFileMIME(fileName: string) {
        if (fileName == null) return null;
        let extName = fileName;
        if (fileName.lastIndexOf(".") > -1) {
            extName = extName.substring(fileName.lastIndexOf(".") + 1)
        }
        var returnObj: any = { Type: "txt", Key: "application/pdf" };
        Variables.AllFileMIME.forEach(e => {
            let keyArr = e.Value.split(/[,| ]/)
            keyArr.forEach(type => {
                if (type == extName) {
                    returnObj = e
                    return e;
                }
            });
        });
        return returnObj;
    }


    /**
     * core：表示桌面平台
     * @param name 
     */
    public static PlatformsExists(name: string): boolean {
        let allPlat = this.plt.platforms();
        let reObj = false;
        for (var i = 0; i < allPlat.length; i++) {
            if (name.toLowerCase() == allPlat[i].toLocaleLowerCase()) {
                reObj = true;
            }
        }
        return reObj;
    }



    public static async Confirm(title, message, OkHandler, CancelHandler, OkText = "确定", ChancelText = "取消") {
        let alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: ChancelText,
                    role: 'cancel',
                    handler: CancelHandler
                },
                {
                    text: OkText,
                    handler: OkHandler
                }
            ]
        });
        alert.present();
    }
    /**
     * 
     * @param title 
     * @param message 
     * @param OkHandler 
     * @param OkText 
     */
    public static async Alert(title, message, OkHandler, OkText = "确定") {
        let alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: OkText,
                    handler: OkHandler
                }
            ]
        });
        alert.present();
    }

    /**
     * 查看列表是否包含
     * @param arrObj 
     * @param value 
     */
    public static ListContains(arrObj, value) {
        for (let index = 0; index < arrObj.length; index++) {
            const element = arrObj[index];
            if (element == value) return true
        }
        return false;
    }
    /**
     * 获取权限列表
     * 权限字符串，第一位表示创建者，第二位管理员，第三位表示超级管理员
     * 判断的权限，1添加，2修改，4查看
     * @param powerInt 权限值
     */
    public static GetPowerList(powerInt): any {
        switch (powerInt) {
            case "7":
                return [1, 2, 4]
            case "6":
                return [2, 4]
            case "5":
                return [1, 4]
            case "4":
                return [4]
            case "3":
                return [1, 2]
            case "2":
                return [2]
            case "1":
                return [1]
            default:
                return [4]
        }
    }


    /**
   * 补全URL地址
   * @param url 
   */
    public static FormartUrl(url) {
        return new ImgUrlPipe().transform(url);
    }


    /**
 * 获取类的所有属性
 * 
 * @param {any} bean 传入的类
 * @returns 返回类的所有字段的字符串，以逗号分隔
 * @memberof CommonService
 */
    public static GetBeanNameStr(bean) {
        var tmpArr = [];
        for (var item in bean) {
            var objV = bean[item];
            if (typeof (objV) != "string" || objV.indexOf('/Date(') != 0) {
                tmpArr.push(item);
            }
        }
        return tmpArr;
    }

    /**
     * 全屏显示图片
     * 
     * @param {string} url 
     * @param {string} picTitle 
     * @returns 
     * @memberof CommonService
     */
    public static FullScreenImage(url: string, picTitle: string) {
        if (picTitle == null) {
            picTitle = this.translate.instant("public.pic");
        }

        if (url == null || url == '' || url == undefined || url == "img/noPic.png") {
            return;
        }
        console.log(url);
        url = this.FormartUrl(url);
        console.log(url);
        if (this.plt.is('ios') || this.plt.is('android')) {
            console.log('真机');
            //   PhotoViewer.show(url, "", { "share": false });
        }
        else {

            //   this.hint('<img style="display: block; margin: 0px;" src="' + url + '"/>', this.translate.instant("public.pic"))
        }
    }

    /**
     * 显示弹出框
     * @param callBack 传入的参数，可以包括回调方法
     */
    static async ShowModal(callBack: any) {
        console.log(1);
        let openObj = await this.modalCtrl.create({
            component: EditModelComponent,
            componentProps: callBack
        });
        console.log(2);
        await openObj.present();
        console.log(3);

    }
}
