import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HomePage } from 'src/app/home/home.page';
import { AzurapiService } from 'src/app/services/azurapi.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  isIconUI: boolean = true;
  retreiveStatus: string;

  constructor(private prompt: PromptService, 
    private storage: Storage, 
    private modalController: ModalController, 
    public azurapi: AzurapiService,
    private shipCategoryData: ShipCategoryDataService) { }

  async ngOnInit() {
    this.prompt.init(400);
    const storageIconUI = await this.storage.get("icon-ui");
    if(storageIconUI != null) {
      this.isIconUI = storageIconUI;
    }
    this.azurapi.retreiveStatus = "";
  }

  async switchUI(isIconUI: boolean) {
    this.storage.set("icon-ui", isIconUI);
    this.isIconUI = isIconUI;
  }

  retreiveLostShips() {
    this.azurapi.init(true);
  }

  exit() {
    this.modalController.dismiss();
  }

  resetCategories() {
    this.modalController.dismiss();
    this.shipCategoryData.sortedCategoryNames = [];
    this.shipCategoryData.allShips = [];
    this.shipCategoryData.promptPreset();
  }

  resetSite() {
    this.modalController.dismiss();
    this.shipCategoryData.sortedCategoryNames = [];
    this.shipCategoryData.allShips = [];
    this.storage.remove("categories");
    this.azurapi.init();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
