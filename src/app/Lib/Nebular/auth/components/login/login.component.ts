/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Fun } from '../../../../../Config/Fun';
import { TranslateService } from '../../../../ngx-translate/public_api';

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
  ) {

  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      loginName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });

  }

  async submit() {

    if (this.userForm.invalid) {
      let formErrors = Fun.FormValidMsg(this.userForm, this.i18n);
      console.log(this.userForm);
      console.log(this.userForm.get("loginName"));
      console.log();
      
      console.log(formErrors);
      // Fun.Hint(formErrors.ErrorMessage, this.translate.instant("public.Invalid_input"))
      return;
    }

    console.log(this.userForm.get("loginName"));
  }
  GetErrMsg(obj:any){
    return Fun.FormErrMsg(obj)
  }
}
