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
  isHelpButtons: boolean = true;
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
    this.isIconUI = await this.getToggleState(this.isIconUI, "icon-ui");
    this.isHelpButtons = await this.getToggleState(this.isHelpButtons, "help-buttons");
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      animated: false
    });
    modal.present();
    modal.onDidDismiss().then(async () => {
      this.isHelpButtons = await this.getToggleState(this.isHelpButtons, "help-buttons");
      const previousState = this.isIconUI;
      this.isIconUI = await this.getToggleState(this.isIconUI, "icon-ui");
      if(this.isIconUI != previousState) {
        this.filter.filter();
      }
    })
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