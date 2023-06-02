import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicableHullsService } from 'src/app/services/applicable-hulls.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-hull-info-panel',
  templateUrl: './hull-info-panel.component.html',
  styleUrls: ['./hull-info-panel.component.scss', '../home.page.scss'],
})
export class HullInfoPanelComponent implements AfterViewInit {

  objectKeys = Object.keys;

  open: boolean = false;
  open120: boolean = true;
  openObtain: boolean = true;

  tableWidth: number = 0;

  @ViewChild("table") hullTable: ElementRef;

  constructor(
    public shipsService: ShipsService,
    public applicableHulls: ApplicableHullsService,
    public misc: MiscService
  ) { }

  ngAfterViewInit() {
    this.open = this.misc.isMobile;
    this.refreshTableWidth();
  }

  refreshTableWidth() {
    setTimeout(() => {
      this.tableWidth = this.hullTable.nativeElement.clientWidth;
    })
  }
}
