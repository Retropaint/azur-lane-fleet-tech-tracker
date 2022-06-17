import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { SettingsComponent } from './prompts/settings/settings.component';
import { AzurapiService } from './services/azurapi.service';
import { FactionTechDataService } from './services/faction-tech-data.service';
import { FilterService } from './services/filter.service';
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
  techMode: string = "ship"
  techModeString = "Tech Summary";
  iconListRefreshCount: number = 2;
  menuIsOpen: boolean;
  filterIsOpen: boolean;

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

    this.factionTechData.init();

    this.misc.setCardSize();
    
    this.misc.isMobile = this.platform.width() < 1024;
    if(!this.misc.isMobile) {
      document.documentElement.style.setProperty('--dead-zone-margin', "200px");
    }

    this.azurapi.init(true).then(() => {
      this.sort.sort("Name");
      this.filter.filter();
    })
    
    window.addEventListener('focus', () => {
      this.onTabFocus();
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
  
  /*
    the icon list refresh is handled here because focusing on the tab is app-wide rather than in the icon list, 
    where it can be activated by just focusing on the component itself
  */
  onTabFocus() {
    // only one refresh is needed at a time, as it's jarring when it keeps doing it during the site's lifespan
    if(this.iconListRefreshCount < 3) {
      this.misc.refreshIconList(true);    
    }
    this.iconListRefreshCount++;
  }
}
