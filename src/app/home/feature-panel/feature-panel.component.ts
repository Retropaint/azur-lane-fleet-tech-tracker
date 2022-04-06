import { Component, Input, OnInit } from '@angular/core';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-feature-panel',
  templateUrl: './feature-panel.component.html',
  styleUrls: ['./feature-panel.component.scss', '../home.page.scss'],
})
export class FeaturePanelComponent {

  @Input() uiMode: string;

  constructor(public shipsService: ShipsService) { }
}
