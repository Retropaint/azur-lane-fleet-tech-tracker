import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { IconLoaderService } from 'src/app/services/icon-loader.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';
import { ShipsService } from 'src/app/services/ships.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.scss'],
})
export class ShipCardComponent implements OnInit, AfterViewInit {

  @ViewChild('levelInput') levelInput: IonInput;
  imageSrc: string = "";
  hoverTitle: string;
  fadeCSS: string = "default";
  flashCSS: string = "out";
  rarity: string;
  hull: string;

  @Input() ship: Ship = null;
  @Input() currentCategory: string;

  fleetTechStatIconWidths = {
    "HP": 16,
    "AA": 17,
    "ASW": 18,
    "TRP": 16,
    "FP": 20,
    "EVA": 15,
    "HIT": 16,
    "AVI": 17,
    "RLD": 15,
  };

  constructor(
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    private sort: SortService,
    private iconLoader: IconLoaderService,
    public app: AppComponent,
    private shipsService: ShipsService,
    private storage: Storage,
    private settingsData: SettingsDataService) { }

  ngOnInit() {
    if(this.ship.hasRetrofit && this.settingsData.settings['retrofit-form'] == 'Yes') {
      this.imageSrc = 'assets/ship thumbnails/retrofits/' + this.ship.id + '.webp';
      this.rarity = this.shipsService.getRetroRarity(this.ship.id);
      this.hull = this.ship.retroHull;
    } else {
      this.imageSrc = 'assets/ship thumbnails/' + this.ship.id + '.webp';
      this.rarity = this.ship.rarity;
      this.hull = this.ship.hull;
    }
    this.hoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
  }

  ngAfterViewInit() {
    // fade in
    setTimeout(() => {
      this.fadeCSS = "";
    }, 100)
  }

  getFallbackThumbnail() {
    this.imageSrc = this.ship.fallbackThumbnail;
  }

  async enterLevel() {
    const modal = await this.modalController.create({
      component: ShipLevelEditorComponent,
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
      this.sort.sort(this.sort.lastType, true);

      this.iconLoader.refresh();

      // flash the card if pressed Confirm
      if(value.data == 'done') {
        this.flashCSS = "in";
        setTimeout(() => {
          this.flashCSS = "out";
        })
      }
    })
  }
}
