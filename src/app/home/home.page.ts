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

  @ViewChild(IonContent) ionContent: IonContent;
  
  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private filter: FilterService,
    public shipsService: ShipsService,
    public app: AppComponent
    ) {}

  async ngAfterViewInit() {
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
      this.setCardSize();

      // only refresh icon UI if it was actually switched
      const previousState = this.isIconUI;
      this.isIconUI = await this.storage.get('ui-mode') == 'Icon';
      if(this.isIconUI != previousState) {
        this.filter.filter();
      }
    })
  }

  async setCardSize() {
    switch(await this.storage.get("ship-card-size")) {
      case "Big": default:
        document.documentElement.style.setProperty('--ship-card-zoom', '1');
      break; case "Small":
        document.documentElement.style.setProperty('--ship-card-zoom', '0.85');
      break;
    }
  }
}