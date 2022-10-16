import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { MiscService } from 'src/app/services/misc.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.scss'],
})
export class ShipCardComponent implements OnInit, AfterViewInit {

  @ViewChild('levelInput') levelInput: IonInput;
  imageSrc: string = "";
  hoverTitle: string;
  fadeCSS: 'in' | 'out' = 'out';
  flashCSS: 'in' | 'out' = 'out';
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
    null: 0
  };

  constructor(
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    public misc: MiscService,
    private shipsService: ShipsService,
    private settingsData: SettingsDataService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getFallbackThumbnail();
    this.hoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
  }

  getHull() {
    if(this.ship.hasRetrofit && this.settingsData.settings['retrofit-forms'] == 'Yes') {
      return this.ship.retroHull;
    } else {
      return this.ship.hull;
    }
  }

  getRarity() {
    if(this.ship.hasRetrofit && this.settingsData.settings['retrofit-forms'] == 'Yes') {
      return this.shipsService.getRetroRarity(this.ship.id);
    } else {
      return this.ship.rarity;
    }
  }

  getImageSrc() {
    if(this.ship.hasRetrofit && this.settingsData.settings['retrofit-forms'] == 'Yes') {
      return 'assets/ship thumbnails/retrofits/' + this.ship.id + '.webp';
    } else {
      return 'assets/ship thumbnails/' + this.ship.id + '.webp';
    }
  }

  ngAfterViewInit() {
    // fade in
    setTimeout(() => {
      this.fadeCSS = "in";
    }, 100)
  }

  getFallbackThumbnail() {
    this.imageSrc = this.ship.fallbackThumbnail;
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
  }
}
