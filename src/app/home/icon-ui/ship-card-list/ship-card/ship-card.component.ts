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
  stat: string;
  bonus: number;
  loadedImage: boolean = false;
  scaleThumbnail: boolean;

  @Input() ship: Ship = null;
  @Input() currentCategory: string;

  constructor(
    private modalController: ModalController,
    public hoverTitles: HoverTitlesService,
    public misc: MiscService,
    private shipsService: ShipsService,
    private settingsData: SettingsDataService,
  ) { }

  ngOnInit() {
    this.imageSrc = this.getImageSrc();
    this.hoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
    this.rarity = this.getRarity();
    this.hull = this.getHull();
    this.stat = this.getStat();
    this.bonus = this.getBonus();

    this.scaleThumbnail = document.documentElement.style.getPropertyValue('--ship-card-zoom') > (1).toString();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fadeCSS = 'in';
    })
  }

  getHull() {
    if(this.ship.hasRetrofit && this.ship.retroHull && this.settingsData.checkBool('retrofit-forms')) {
      return this.ship.retroHull;
    } else {
      return this.ship.hull;
    }
  }

  getRarity() {
    if(this.ship.hasRetrofit && this.settingsData.checkBool('retrofit-forms')) {
      return this.shipsService.getRetroRarity(this.ship.id);
    } else {
      return this.ship.rarity;
    }
  }

  getImageSrc() {
    if(this.ship.hasRetrofit && this.settingsData.checkBool('retrofit-forms')) {
      return this.ship.retroThumbnail;
    } else {
      return 'assets/ship thumbnails/' + this.ship.id + '.webp';
    }
  }

  getFallbackThumbnail() {
    this.imageSrc = this.ship.fallbackThumbnail;
  }

  getStat() {
    return (this.misc.filteringMaxTech) ? this.ship.techStat : this.ship.obtainStat
  }

  getBonus() {
    return (this.misc.filteringMaxTech) ? this.ship.techBonus : this.ship.obtainBonus
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
