import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { SettingsComponent } from './prompts/settings/settings.component';
import { ApplicableHullsService } from './services/applicable-hulls.service';
import { AzurapiService } from './services/azurapi.service';
import { FactionTechDataService } from './services/faction-tech-data.service';
import { FilterService } from './services/filter.service';
import { MiscService } from './services/misc.service';
import { PromptService } from './services/prompt.service';
import { SettingsDataService } from './services/settings-data.service';
import { ShipsService } from './services/ships.service';
import { SortService } from './services/sort.service';
import { FleetTechService } from './services/fleet-tech.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  techMode: string = "ship"
  techModeString = "Tech Summary";
  menuIsOpen: boolean;
  filterIsOpen: boolean;
  isFocused: boolean;

  constructor(private storage: Storage, 
    private azurapi: AzurapiService, 
    private sort: SortService,
    private ships: ShipsService,
    private platform: Platform,
    private settingsData: SettingsDataService,
    private factionTechData: FactionTechDataService,
    private prompt: PromptService,
    private menuController: MenuController,
    public misc: MiscService,
    private filter: FilterService,
    private applicableHulls: ApplicableHullsService,
    private fleetTech: FleetTechService
  ) {}

  async ngOnInit() {
    const randomLog = ["Uptier Shigure!", "Downtier Drake!", "Liduke pls come back :(", "Arknights is better", "Don't look at the code. It's not for my sake it's for yours, trust me."];
    const chosenLog = Math.floor(Math.random() * randomLog.length);
    setTimeout(() => {
      console.log(randomLog[chosenLog]);
    }, 500) 

    this.storage.create();

    await this.settingsData.refresh();

    await this.ships.init();

    this.applicableHulls.init();

    this.factionTechData.init();

    this.misc.isMobile = this.platform.width() < 1024;
    if(!this.misc.isMobile) {
      document.documentElement.style.setProperty('--dead-zone-margin', "200px");
    }

    this.azurapi.init().then(() => {
      this.sort.sort("Name", false, false);
      this.fleetTech.refresh();
      this.filter.init();
    })
    
    window.addEventListener('focus', () => {
      this.onTabFocus();
    })

    window.addEventListener('blur', () => {
      this.onTabBlur();
    })
  }

  openSettings() {
    this.prompt.openPrompt(SettingsComponent);
    this.menuController.close('side');
  }

  switchTechMode() {
    this.misc.switchTechMode();
    this.menuController.close('first');
  }

  async onResize(event) {
    this.misc.isMobile = event.target.innerWidth < 1024;
  }
  
  onTabFocus() {
    this.misc.hasFocus = true;
    if(this.misc.blurOnShipListLoad) {
      this.misc.refreshShipList();
    }
  }

  onTabBlur() {
    this.misc.hasFocus = false;
  }
  
}
