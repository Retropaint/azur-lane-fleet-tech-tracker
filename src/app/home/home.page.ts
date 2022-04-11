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
  uiMode: string;
  techMode: string = "ship";
  techModeString = "Tech Summary";

  @ViewChild(IonContent) ionContent: IonContent;
  
  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private filter: FilterService,
    public shipsService: ShipsService,
    public app: AppComponent
    ) {}

  async ngAfterViewInit() {

    // get UI mode if it exists, default to icon if it doesn't
    if(await this.storage.get('ui-mode')) {
      this.uiMode = await this.storage.get("ui-mode");
    } else {
      this.storage.set("ui-mode", 'Icon');
    }

    this.setCardSize();
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      animated: false
    });
    modal.present();
    modal.onDidDismiss().then(async () => {

      // only refresh icon UI if it was actually switched
      const previousState = this.uiMode;
      this.uiMode = await this.storage.get('ui-mode');
      if(this.uiMode != previousState) {
        this.filter.filter();
      }
      
      this.setCardSize();
    })
  }

  async setCardSize() {
    const num = await this.storage.get("ship-card-size")/100
    document.documentElement.style.setProperty('--ship-card-zoom', num.toString());
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
}