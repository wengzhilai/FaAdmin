/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { Platform, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from './Lib/ngx-translate/public_api';
import { Fun } from './Config/Fun';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService,
     platform: Platform,
    _loadingCtrl: LoadingController,
    _toastCtrl: ToastController,
    _alertCtrl: AlertController,
    _translate: TranslateService
    ) {
    Fun.Init(_loadingCtrl, _toastCtrl, platform, _alertCtrl, _translate);

  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
