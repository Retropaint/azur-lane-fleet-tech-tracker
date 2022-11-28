import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { SortService } from 'src/app/services/sort.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-sheet-ship-row, [app-sheet-ship-row]',
  templateUrl: './sheet-ship-row.component.html',
  styleUrls: ['./sheet-ship-row.component.scss', '../sheet-category.component.scss'],
})
export class SheetShipRowComponent implements OnInit {

  @Input() ship: Ship;
  @Input() category: string;
  fleetTechHoverTitle: string;
  flashCSS: string = "out";
  rarity: string;
  hull: string;

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 17,
    "TRP": 16,
    "FP": 22,
    "EVA": 17,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  fleetTechStatIconHeights = {
    "HP": 16,
    "AA": 17,
    "ASW": 15,
    "TRP": 16,
    "FP": 12,
    "EVA": 17,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  }

  constructor(
    public filter: FilterService,
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    private sort: SortService,
    private settingsData: SettingsDataService,
    private shipsService: ShipsService,
    public misc: MiscService
  ) {}

  ngOnInit() {
    this.fleetTechHoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
  }

  getHull() {
    if(this.settingsData.settings['retrofit-forms'] == 'Yes' && this.ship.hasRetrofit) {
      return this.ship.retroHull;
    } else {
      return this.ship.hull;
    }
  }

  getRarity() {
    if(this.settingsData.settings['retrofit-forms'] == 'Yes' && this.ship.hasRetrofit) {
      return this.shipsService.getRetroRarity(this.ship.id);
    } else {
      return this.ship.rarity;
    }
  }

  async enterLevel() {
    if(this.misc.isBulkSelect) {
      this.ship.isBulkSelected = !this.ship.isBulkSelected;
      
      if(this.ship.isBulkSelected) {
        this.misc.bulkSelected.push(this.ship)
      } else {
        this.misc.bulkSelected.splice(this.misc.bulkSelected.indexOf(this.ship), 1);
      }

      if(this.misc.bulkSelected.length == 0) {
        this.misc.isBulkSelect = false;
      }
      return;
    }

    const modal = await this.modalController.create({
      component:ShipLevelEditorComponent,
      animated: false,
      componentProps: {
        "ship": this.ship,
        "name": this.ship.name,
        "level": this.ship.level,
        "isObtained": this.ship.isObtained
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      // flash the row if pressed Confirm
      if(value.data == 'done') {
        this.flashCSS = "in";
        setTimeout(() => {
          this.flashCSS = "out";
        })
      }
    })
  }

  getStat() {
    return (this.misc.filteringMaxTech) ? this.ship.techStat : this.ship.obtainStat
  }

  getBonus() {
    return (this.misc.filteringMaxTech) ? this.ship.techBonus : this.ship.obtainBonus
  }
}
