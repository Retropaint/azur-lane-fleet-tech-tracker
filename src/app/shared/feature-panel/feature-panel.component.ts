import { Component, Input } from '@angular/core';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-feature-panel',
  templateUrl: './feature-panel.component.html',
  styleUrls: ['./feature-panel.component.scss', '../../home/home.page.scss'],
})
export class FeaturePanelComponent {

  @Input() uiMode: string;

  constructor(public misc: MiscService) { }
}
