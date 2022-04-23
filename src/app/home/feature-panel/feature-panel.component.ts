import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-panel',
  templateUrl: './feature-panel.component.html',
  styleUrls: ['./feature-panel.component.scss', '../home.page.scss'],
})
export class FeaturePanelComponent {

  @Input() uiMode: string;

  constructor() { }
}
