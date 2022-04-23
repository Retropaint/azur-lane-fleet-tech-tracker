import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { SettingsComponent } from './prompts/settings/settings.component';
import { AzurapiService } from './services/azurapi.service';
import { FactionTechDataService } from './services/faction-tech-data.service';
import { MiscService } from './services/misc.service';
import { PromptService } from './services/prompt.service';
import { SettingsDataService } from './services/settings-data.service';
import { ShipsService } from './services/ships.service';
import { SortService } from './services/sort.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  latestVersion: string = "1.5";
  hullInfoIsOpen: boolean;
  techMode: string = "ship"
  techModeString = "Tech Summary";

  constructor(private storage: Storage, 
    private azurapi: AzurapiService, 
    private sort: SortService,
    private ships: ShipsService,
    private platform: Platform,
    private settingsData: SettingsDataService,
    private factionTechData: FactionTechDataService,
    private prompt: PromptService,
    private menuController: MenuController,
    public misc: MiscService
  ) {}

  async ngOnInit() {
    const randomLog = ["Uptier Shigure!", "Downtier Drake!", "Liduke pls come back :(", "Arknights is better", "Don't look at the code. It's not for my sake it's for yours, trust me."];
    const chosenLog = Math.floor(Math.random() * randomLog.length);
    setTimeout(() => {
      console.log(randomLog[chosenLog]);
    }, 500) 

    this.storage.create();

    await this.settingsData.refresh();

    this.factionTechData.init();

    this.misc.isMobile = this.platform.is('mobileweb');
    if(!this.misc.isMobile) {
      document.documentElement.style.setProperty('--dead-zone-margin', "200px");
    }

    await this.ships.init();

    // replace old ship data with new, if versions changed
    if(await this.storage.get("ships") == null || await this.storage.get("version") != this.latestVersion || await this.storage.get("version") == null) {
      this.azurapi.init().then(() => {
        this.sort.sort("Name");
      })
    } else {
      this.sort.sort("Name");
    }
    
    this.storage.set("version", this.latestVersion);
  }

  openSettings() {
    this.prompt.openPrompt(SettingsComponent);
    this.menuController.close('first');
  }

  openHullInfo() {
    this.hullInfoIsOpen = !this.hullInfoIsOpen;
    this.menuController.close('first');
  }

  switchTechMode() {
    this.misc.switchTechMode();
    this.menuController.close('first');
  }
}
