import { Injectable } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { ShipCardListComponent } from '../home/icon-ui/ship-card-list/ship-card-list.component';
import { SheetCategoryComponent } from '../home/sheet-ui/sheet-category/sheet-category.component';
import { Ship } from '../interfaces/ship';
import { SettingsDataService } from './settings-data.service';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  isMobile: boolean;
  
  techMode: string = 'ship'; 
  techModeString: string = "Tech Summary";
  uiMode: 'Icon' | 'Sheet' = null;
  
  ionContent: IonContent;

  // stored here instead of filter to prevent circular dependencies 
  shipsFilterPass = {};

  // used to call the refresh function
  shipCardList: ShipCardListComponent;

  sheetCategory: SheetCategoryComponent

  // var stored here to allow other components to use it, but home page handles other logic
  isBulkSelect: boolean;
  bulkSelected: Ship[] = [];

  // used to know if the Edit Ships should appear
  usedBulkSelectEditAll: boolean;

  considerStatusSorting: boolean = true;

  includeNonTechShips: boolean = false;

  filteringMaxTech: boolean = true;

  hasFocus: boolean = true;
  blurOnShipListLoad: boolean = false;

  constructor() { }

  async switchTechMode() {
    if(this.techMode == "ship") {
      this.techMode = "stat";
      this.techModeString = "Ship Database"
    } else {
      this.techMode = "ship";
      this.techModeString = "Tech Summary";
    }
  }

  scrollUp() {
    this.ionContent.scrollToTop();
  }

  refreshShipList() {
    if(this.shipCardList != null) {
      this.shipCardList.refresh();
    }
    if(this.sheetCategory != null) {
      this.sheetCategory.refresh();
    }
  }
}
