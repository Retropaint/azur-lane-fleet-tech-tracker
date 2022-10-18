import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-sheet-ui',
  templateUrl: './sheet-ui.component.html',
  styleUrls: ['./sheet-ui.component.scss', '../home.page.scss'],
})
export class SheetUIComponent {
  constructor(
    public home: HomePage, 
    public filter: FilterService,
    public shipsService: ShipsService,
    public app: AppComponent,
    public misc: MiscService
  ) {}
}
