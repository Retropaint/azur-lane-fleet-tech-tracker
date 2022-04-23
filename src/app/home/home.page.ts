import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonContent, MenuController, ModalController, Platform } from '@ionic/angular';
import { SettingsComponent } from '../prompts/settings/settings.component';
import { ShipsService } from '../services/ships.service';
import { MobileWarningComponent } from '../prompts/mobile-warning/mobile-warning.component';
import { MiscService } from '../services/misc.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', 'filter.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild(IonContent) ionContent: IonContent;
  
  constructor(
    private modalController: ModalController,
    public shipsService: ShipsService,
    public misc: MiscService,
    private menuController: MenuController  
  ) {}

  async ngAfterViewInit() {

    // get UI mode if it exists, default to icon if it doesn't
    this.misc.initUiMode();
    
    setTimeout(async () => {
      if(this.misc.isMobile) {
        const modal = await this.modalController.create({
          component: MobileWarningComponent,
          animated: false
        })
        //modal.present();
      }
    }, 250)
    
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      animated: false
    });
    modal.present();
  }

  openSideMenu() {
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
  }

  backToTop() {
    this.ionContent.scrollToTop();
  }
}