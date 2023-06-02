import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonContent, MenuController, ModalController } from '@ionic/angular';
import { SettingsComponent } from '../prompts/settings/settings.component';
import { ShipLevelEditorComponent } from '../prompts/ship-level-editor/ship-level-editor.component';
import { AzurapiService } from '../services/azurapi.service';
import { MiscService } from '../services/misc.service';
import { PromptService } from '../services/prompt.service';
import { SettingsDataService } from '../services/settings-data.service';
import { ShipsService } from '../services/ships.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', 'filter.scss'],
})
export class HomePage implements AfterViewInit {

  shouldBackgroundFadeIn: boolean;

  @ViewChild(IonContent) ionContent: IonContent;
  
  constructor(
    private modalController: ModalController,
    public shipsService: ShipsService,
    public misc: MiscService,
    private menuController: MenuController,
    private prompt: PromptService,
    public azurapi: AzurapiService,
    private settingsData: SettingsDataService
  ) {}

  async ngAfterViewInit() {
    // get UI mode if it exists, default to icon if it doesn't
    this.misc.uiMode = this.settingsData.settings['ui-mode']
    this.misc.ionContent = this.ionContent;

    setTimeout(() => {
      this.shouldBackgroundFadeIn = true;
    }, 500)
  }

  async openSettingsModal() {
    this.prompt.openPrompt(SettingsComponent);
  }

  openSideMenu() {
    this.menuController.enable(true, 'side');
    this.menuController.open('side');
  }

  openSortAndFilterMenu() {
    this.menuController.enable(true, 'filter');
    this.menuController.open('filter');
  }

  backToTop() {
    this.ionContent.scrollToTop();
  }

  async toggleBulkSelect() {
    this.misc.isBulkSelect = !this.misc.isBulkSelect;
    if(!this.misc.isBulkSelect && this.misc.bulkSelected.length > 0) {
      const modal = await this.modalController.create({
        component: ShipLevelEditorComponent,
        animated: false,
        componentProps: {
          'isBulk': true
        }
      })
      modal.present();
    }
  }
}