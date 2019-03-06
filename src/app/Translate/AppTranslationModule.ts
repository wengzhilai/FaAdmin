import { NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Variables } from "../Config/Variables";
import { Observable } from 'rxjs';
import { CookiesHelper } from '../Helper/CookiesHelper';
import { TranslateModule, TranslateLoader, TranslateHttpLoader ,TranslateService} from '../Lib/ngx-translate/public_api';

export function createTranslateLoader(http: HttpClient) {

  let prefix = './assets/i18n/';
  // let remotePrefix = Config.imgUrl + 'Content/Apk/res/2.0.0/';
  let remotePrefix = prefix;
  let suffix = '.json';
  console.log(prefix)

  let tmp = new TranslateHttpLoader(http,prefix,suffix)
  tmp.getTranslation = (lang: string) => {

    // return http.get(`${remotePrefix}${lang}${suffix}`).catch(e=>{
    //   console.error('加载远程语言路径失败:'+`${remotePrefix}${lang}${suffix}`)
    //   return http.get(`${prefix}${lang}${suffix}`)
    // })
    console.log(`${remotePrefix}${lang}${suffix}`);
    return Observable.create((observer) => {
      http.get(`${remotePrefix}${lang}${suffix}`).subscribe({
        next: x => {
          observer.next(x);
          observer.complete();
        },
        error: err =>{
          console.error('加载远程语言路径失败:'+`${remotePrefix}${lang}${suffix}`)
          console.log("加载本地语言路径：" + `${prefix}${lang}${suffix}`)
          http.get(`${prefix}${lang}${suffix}`).subscribe({
            next: x => {
              observer.next(x);
              observer.complete();
            }
          });
        }
      });
    });
  }
  return tmp;
}


// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

const translationOptions = {
  loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  };

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  constructor(translate: TranslateService) {
    // translate.addLangs(["ch"]);
    // translate.setDefaultLang('ch');
    // translate.use('ch');
    console.log("读取多语言")
    //是否配置了语言
    if (Variables.LanguageArray != null && Variables.LanguageArray.length > 0) {
      var allLanguageKey = []
      Variables.LanguageArray.forEach(e => {
        allLanguageKey.push(e.Key)
      })
      translate.addLangs(allLanguageKey);
      console.log(translate.getLangs())
      allLanguageKey.forEach(e => {
        translate.setDefaultLang(e);
      })
      let language = CookiesHelper.GetCookie('Language')
      if (language != null && language != '') {
        translate.use(language);
      }
      else {
        translate.use(allLanguageKey[0]);
      }

    }
  }
}
