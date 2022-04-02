import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail, IonInput, ModalController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { IconUIComponent } from '../../icon-ui.component';
import { HomePage } from 'src/app/home/home.page';
import { IconLoaderService } from 'src/app/services/icon-loader.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { SortService } from 'src/app/services/sort.service';
import { ShipsService } from 'src/app/services/ships.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.scss'],
})
export class ShipCardComponent implements OnInit, AfterViewInit {

  @ViewChild('levelInput') levelInput: IonInput;
  imageSrc: string = "";
  hoverTitle: string;
  fadeStatus: string = "default";
  outlineStatus: string = "out";

  @Input() ship = null;
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
    private shipsService: ShipsService,
    private iconLoader: IconLoaderService,
    public app: AppComponent) { }

  ngOnInit() {
    this.imageSrc = 'assets/ship thumbnails/' + this.ship.id + '.webp';
    this.hoverTitle = this.hoverTitles.getTechStatTitle(this.ship);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fadeStatus = "";
    }, 100)
  }

  getFallbackThumbnail() {
    this.imageSrc = this.ship.thumbnail;
  }

  async enterLevel() {
    const modal = await this.modalController.create({
      component: ShipLevelEditorComponent,
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
      if(value.data != null) {
        if(this.sort.lastType == "Level") {
          this.sort.sort("Level", true);
        }
        this.iconLoader.refresh(this.ship);

        this.outlineStatus = "in";
        setTimeout(() => {
          this.outlineStatus = "out";
        })
      }
    })
  }
}
