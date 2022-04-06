import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { SortService } from 'src/app/services/sort.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-sheet-ship-row',
  templateUrl: './sheet-ship-row.component.html',
  styleUrls: ['./sheet-ship-row.component.scss', '../sheet-category.component.scss'],
})
export class SheetShipRowComponent implements OnInit {

  @Input() ship: Ship;
  @Input() category: string;
  fleetTechHoverTitle: string;
  flashCSS: string = "out";
  ignoredCSS: string = "";

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 17,
    "TRP": 16,
    "FP": 17,
    "EVA": 15,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  constructor(
    public filter: FilterService,
    private shipsService: ShipsService,
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    private sort: SortService) {}

  ngOnInit() {
    this.fleetTechHoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
    if(this.ship.isIgnored) {
      this.ignoredCSS = "ignored";
    }
  }

  async enterLevel() {
    const modal = await this.modalController.create({
      component:ShipLevelEditorComponent,
      animated: false,
      componentProps: {
        "ship": this.ship,
        "name": this.ship.name,
        "level": this.ship.level,
        "isIgnored": this.ship.isIgnored
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      this.sort.sort(this.sort.lastType, true)

      this.ship.isIgnored ? this.ignoredCSS = "ignored" : this.ignoredCSS = "";

      // flash the row if pressed Confirm
      if(value.data == 'done') {
        this.flashCSS = "in";
        setTimeout(() => {
          this.flashCSS = "out";
        })
      }
    })
  }
}
