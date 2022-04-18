import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { SortService } from 'src/app/services/sort.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';

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
  rarity: string;
  hull: string;

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
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    private sort: SortService,
    private settingsData: SettingsDataService,
    private shipsService: ShipsService) {}

  ngOnInit() {
    this.fleetTechHoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
    if(this.settingsData.settings['retrofit-form'] && this.ship.hasRetrofit) {
      this.hull = this.ship.retroHull;
      this.rarity = this.shipsService.getRetroRarity(this.ship.id);
    } else {
      this.hull = this.ship.hull;
      this.rarity = this.ship.rarity;
    }
  }

  async enterLevel() {
    console.log(this.ship.isObtained)
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
      this.sort.sort(this.sort.lastType, true)

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
