import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">{{'CreatedBy'|translate}} <b>{{'CreatedByName'|translate}}</b>2017</span>
    <div class="socials">

    </div>
  `,
})
export class FooterComponent {
}
