import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AzurapiService } from 'src/app/services/azurapi.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipsService } from 'src/app/services/ships.service';
import { CreditsComponent } from '../credits/credits.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {

  @ViewChild('autoResize') autoResize: ElementRef;
  isIconUI: boolean = true;
  modalIndex: number;

  constructor(private prompt: PromptService, 
    private storage: Storage, 
    private modalController: ModalController, 
    public azurapi: AzurapiService,
    private shipsService: ShipsService) { }

  ngAfterViewInit() {
    console.log(this.autoResize);
    this.modalIndex = this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  retreiveLostShips() {
    this.azurapi.init(true);
  }

  exit() {
    this.modalController.dismiss();
  }

  resetCategories() {
    this.prompt.openConfirmation(this.modalIndex, "RESET CATEGORIES", "All categories, including custom, will be deleted. Levels and settings preferences will be intact. Proceed?")
      .then(isYes => {
        if(isYes) {
          this.modalController.dismiss();
          this.azurapi.init(true);
        }
      })
  }

  resetSite() {
    this.prompt.openConfirmation(this.modalIndex, "RESET SITE", "All ship data and settings preferences will be deleted. Proceed?")
      .then(isYes => {
        if(isYes) {
          this.modalController.dismiss();
          this.shipsService.ships = [];
          this.storage.remove("ships");
          this.azurapi.init();
        }
      })
  }

  openCredits() {
    this.prompt.openAnotherPrompt(this.modalIndex, CreditsComponent);
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
