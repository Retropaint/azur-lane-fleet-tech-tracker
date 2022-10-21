import { Component, Input, OnInit } from '@angular/core';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-hull-info-panel',
  templateUrl: './hull-info-panel.component.html',
  styleUrls: ['./hull-info-panel.component.scss', '../home.page.scss'],
})
export class HullInfoPanelComponent implements OnInit {

  @Input() mode: string = "Icon";

  fold: boolean = true;

  constructor(
    public shipsService: ShipsService
  ) { }

  ngOnInit() {
    this.fold = this.mode == 'Icon';
  }
}
