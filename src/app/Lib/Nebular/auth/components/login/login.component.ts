/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Fun } from '../../../../../Config/Fun';
import { TranslateService } from '../../../../ngx-translate/public_api';
import { HttpHelper } from '../../../../../Helper/HttpHelper';
import { DtoResultObj } from '../../../../../Model/DtoRec/DtoResult';
import { UserDto } from '../../../../../Model/DtoRec/UserDto';
import { GlobalHelper } from '../../../../../Helper/GlobalHelper';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent implements OnInit {
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
