import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '../../../Lib/ngx-translate/public_api';
import { HttpHelper } from '../../../Helper/HttpHelper';
import { Fun } from '../../../Config/Fun';
import { GlobalHelper } from '../../../Helper/GlobalHelper';
import { DtoResultObj } from '../../../Model/DtoRec/DtoResult';
import { UserDto } from '../../../Model/DtoRec/UserDto';

@Component({
  selector: 'ngx-ng-user-login',
  templateUrl: './ng-user-login.component.html',
  styleUrls: ['./ng-user-login.component.scss']
})
export class NgUserLoginComponent implements OnInit {
  i18n = 'Login'

  rememberMe = false;
  userForm: FormGroup;

  constructor(
    protected router: Router,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public httpHelper: HttpHelper,
  ) {

  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      loginName: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });

  }

  async submit() {

    if (this.userForm.invalid) {
      let formErrors = Fun.FormValidMsg(this.userForm, this.i18n);
      Fun.Hint(formErrors.ErrorMessage, this.translate.instant("public.Invalid_input"))
      return;
    }
    //认证登录
    await Fun.ShowLoading();
    this.httpHelper.Post("Auth/UserLogin", this.userForm.value).then((result: DtoResultObj<UserDto>) => {
      Fun.HideLoading();
      if (result.IsSuccess) {
        GlobalHelper.SetToken(result.Code)
        GlobalHelper.SetUserObject(result.Data)
        this.router.navigateByUrl("pages");
      }
      else {
        Fun.Hint(result.Msg);
      }
      console.log(result);
    })
  }
  GetErrMsg(obj: any) {
    return Fun.FormErrMsg(obj)
  }
}
