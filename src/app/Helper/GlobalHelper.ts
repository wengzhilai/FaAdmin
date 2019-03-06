import { CookiesHelper } from "./CookiesHelper";
export class GlobalHelper {

	public static SetToken(token: string) {
		console.log("保存Token：" + token)
		if (token == null || token == "") {
			CookiesHelper.DeleteCookie("token");
		}
		else {
			CookiesHelper.SetCookie("token", token);
		}
	}

	public static GetToken() {
		return CookiesHelper.GetCookie('token');
	}


	public static SetUserObject(user: any) {
		console.log("保存UserObject对象：" )
		console.log(user);
		if (user == null || user == "") {
			CookiesHelper.DeleteCookie("UserObject");
		}
		else {
			CookiesHelper.SetObjectCookie("UserObject", user);
		}
	}
	public static GetUserObject():any {
		return CookiesHelper.GetObjectCookie('UserObject');
	}


	/**
	 * 是否登录
	 */
	static _IsLogin: boolean;
	public static get IsLogin(): boolean {
		let toke = this.GetToken()
		if (toke == null || toke == "")
			this._IsLogin = false
		else
			this._IsLogin = true
		return this._IsLogin
	}
	public static set IsLogin(val: boolean) {
		this._IsLogin = val;
	}
	/**
	 * 退出登录，并清除所有登录信息
	 */
	public static LoginOut(): void {
		console.log("退出登录")
		CookiesHelper.DeleteCookie("token");
		CookiesHelper.SetCookie("token","");
		CookiesHelper.DeleteCookie("UserObject");
		this.IsLogin = false
	}

}