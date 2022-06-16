import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AzurapiService } from 'src/app/services/azurapi.service';
import { CsvService } from 'src/app/services/csv.service';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { PromptService } from 'src/app/services/prompt.service';
import { SettingsDataService } from 'src/app/services/settings-data.service';
import { ShipsService } from 'src/app/services/ships.service';
import { CreditsComponent } from '../credits/credits.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit, OnInit {

  @ViewChild('autoResize') autoResize: ElementRef;
  modalIndex: number;
  inputShipCardSize: number;

  // store original states of settings in-case of cancelling
  initialStates = {};

  constructor(private prompt: PromptService, 
    private storage: Storage, 
    private modalController: ModalController, 
    public azurapi: AzurapiService,
    private shipsService: ShipsService,
    public csv: CsvService,
    private misc: MiscService,
    private settingsData: SettingsDataService,
    private filter: FilterService
  ) { }

  ngOnInit() {
    this.csv.settingsText = "";
  }

  async ngAfterViewInit() {
    this.modalIndex = this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
    this.inputShipCardSize = await this.storage.get("ship-card-size") || 100;

    this.initialStates = {
      uiMode: await this.storage.get("ui-mode"),
      shipCardSize: await this.storage.get("ship-card-size"),
      retrofitForms: await this.storage.get("retrofit-forms")
    }
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

  importCSV(event) {
    this.csv.import(event.target['files'][0]);
  }

  openCredits() {
    this.prompt.openAnotherPrompt(this.modalIndex, CreditsComponent);
  }

  cancel() {
    this.storage.set("ui-mode", this.initialStates["uiMode"]);
    this.storage.set("ship-card-size", this.initialStates["shipCardSize"]);
    this.storage.set("retrofit-forms", this.initialStates["retrofitForms"]);
    this.modalController.dismiss();
  }

  async save() {
    await this.storage.set("ship-card-size", this.inputShipCardSize);
    
    await this.settingsData.refresh().then(() => {
      this.misc.uiMode = this.settingsData.settings['ui-mode'];
      this.misc.setCardSize();
    })

    this.misc.refreshIconList();
    this.filter.filter();
    
    this.modalController.dismiss();
  }

  exit() {
    this.cancel();
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
