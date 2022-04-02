import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AzurapiService } from './services/azurapi.service';
import { FilterService } from './services/filter.service';
import { ShipsService } from './services/ships.service';
import { SortService } from './services/sort.service';
import { SortListComponent } from './home/sort-list/sort-list.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isMobile: boolean;

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
    await this.azurapi.init().then(() => {
      this.sort.sort("Name");
    });
  }
}
