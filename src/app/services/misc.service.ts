import { Injectable } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ShipCardListComponent } from '../home/icon-ui/ship-card-list/ship-card-list.component';
import { SettingsDataService } from './settings-data.service';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  isMobile: boolean;
  
  techMode: string = 'ship'; 
  techModeString: string = "Tech Summary";
  uiMode: string = "Icon";
  
  ionContent: IonContent;

  // stored here instead of filter to prevent circular dependencies 
  shipsFilterPass = {};

  // used to call the refresh function
  shipCardList: ShipCardListComponent;

  isBulkSelect: boolean;

  constructor(
    private settingsData: SettingsDataService,
    private storage: Storage,
  ) { }

  async initUiMode() {
    if(await this.storage.get('ui-mode')) {
      this.uiMode = await this.storage.get("ui-mode");
    } else {
      this.storage.set("ui-mode", 'Icon');
    }
  }

  async switchTechMode() {
    if(this.techMode == "ship") {
      this.techMode = "stat";
      this.techModeString = "Ship Database"
    } else {
      this.techMode = "ship";
      this.techModeString = "Tech Summary";
    }
  }

  async setCardSize() {
    const num = this.settingsData.settings['ship-card-size']/100
    document.documentElement.style.setProperty('--ship-card-zoom', num.toString());
  }

  scrollUp() {
    this.ionContent.scrollToTop();
  }

  refreshIconList(delay: boolean = false) {
    if(this.shipCardList != null) {
      if(delay) {
        this.shipCardList.rows = [];
        setTimeout(() => {
          this.shipCardList.refresh();
        }, 250)
      } else {
        this.shipCardList.refresh();
      }
    }
  }

  toggleBulkSelect() {
    this.isBulkSelect = !this.isBulkSelect;
  }
}
