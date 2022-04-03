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
  modalIndex: number;
  inputShipCardSize: number;

  // store original states of settings in-case of cancelling
  initialStates = {};

  constructor(private prompt: PromptService, 
    private storage: Storage, 
    private modalController: ModalController, 
    public azurapi: AzurapiService,
    private shipsService: ShipsService) { }

  async ngAfterViewInit() {
    this.modalIndex = this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
    this.inputShipCardSize = await this.storage.get("ship-card-size") || 100;

    this.initialStates = {
      uiMode: await this.storage.get("ui-mode"),
      shipCardSize: await this.storage.get("ship-card-size")
    }
  }

  exit() {
    this.cancel();
    this.modalController.dismiss();
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

  cancel() {
    this.storage.set("ui-mode", this.initialStates["uiMode"]);
    this.storage.set("ship-card-size", this.initialStates["shipCardSize"]);
    this.modalController.dismiss();
  }

  save() {
    this.storage.set("ship-card-size", this.inputShipCardSize);
    this.modalController.dismiss();
  }

  openCredits() {
    this.prompt.openAnotherPrompt(this.modalIndex, CreditsComponent);
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
