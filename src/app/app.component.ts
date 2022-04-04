import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AzurapiService } from './services/azurapi.service';
import { ShipsService } from './services/ships.service';
import { SortService } from './services/sort.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isMobile: boolean;
  latestVersion: string = "1.0";

  constructor(private storage: Storage, 
    private azurapi: AzurapiService, 
    private sort: SortService,
    private ships: ShipsService,
    private platform: Platform) {
    this.storage.create();
  }

  async ngOnInit() {
    this.isMobile = this.platform.is('mobileweb');
    if(!this.isMobile) {
      document.documentElement.style.setProperty('--dead-zone-margin', "200px");
    }

    await this.ships.init();
    
    // replace old ship data with new, if versions changed
    if(await this.storage.get("ships") == null || await this.storage.get("currentVersion") != this.latestVersion) {
      this.azurapi.init().then(() => {
        this.sort.sort("Name");
      })
    } else {
      this.sort.sort("Name");
    }
    
    this.storage.set("currentVersion", this.latestVersion);
  }
}
