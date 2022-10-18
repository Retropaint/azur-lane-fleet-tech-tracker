import { Component } from '@angular/core';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-icon-ui',
  templateUrl: './icon-ui.component.html',
  styleUrls: ['./icon-ui.component.scss', '../home.page.scss'],
})
export class IconUIComponent {
  constructor(
    public misc: MiscService,
    public shipsService: ShipsService
  ) {}
}
