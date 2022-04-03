import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FilterService } from '../services/filter.service';
import { SettingsComponent } from '../prompts/settings/settings.component';
import { ShipsService } from '../services/ships.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', 'filter.scss'],
})
export class HomePage implements AfterViewInit {
  isIconUI: boolean = true;
  filterCss: string = "unselected";
  sortCss: string = "unselected";
  platformCSS: string;

  @ViewChild(IonContent) ionContent: IonContent;
  
  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private storage: Storage,
    private filter: FilterService,
    public shipsService: ShipsService,
    public app: AppComponent
    ) {}

  async ngAfterViewInit() {
    if(this.platform.is('mobileweb')) {
      this.platformCSS = "mobile";
    } else {
      this.platformCSS = "desktop";
    }
    this.isIconUI = await this.storage.get('ui-mode') == 'Icon';
    this.setCardSize();
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      animated: false
    });
    modal.present();
    modal.onDidDismiss().then(async () => {
      const previousState = this.isIconUI;
      this.isIconUI = await this.storage.get('ui-mode') == 'Icon';
      if(this.isIconUI != previousState) {
        this.filter.filter();
      }
      this.setCardSize();
    })
  }

  async setCardSize() {
    switch(await this.storage.get("ship-card-size")) {
      case "Big": default:
        document.documentElement.style.setProperty('--ship-card-zoom', '1');
      break; case "Small":
        document.documentElement.style.setProperty('--ship-card-zoom', '0.8');
      break;
    }
  }

  async getToggleState(toggleToChange: any, storageName: string) {
    const storageToggle = await this.storage.get(storageName);
    if(storageToggle != null) {
      toggleToChange = storageToggle;
    }
    return toggleToChange;
  }

  toggleFilter() {
    if(this.filterCss == "unselected") {
      this.filterCss = "selected";
    } else {
      this.filterCss = "unselected";
    }
  }

  toggleSort() {
    if(this.sortCss == "unselected") {
      this.sortCss = "selected";
    } else {
      this.sortCss = "unselected";
    }
  }
}