import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
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
  inputShipCardsPerRow: number;
  confirmedChanges: boolean;
  isInvalidImport: boolean;

  // store original states of settings in-case of cancelling
  initialSettings = {};

  importedCsvSubscription = new Subscription();

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

    this.csv.importStatus.subscribe(wasSuccessful => {
      if(wasSuccessful) {
        this.save();
      } else {
        this.isInvalidImport = true;
      }
    })
  }

  async ngAfterViewInit() {
    this.modalIndex = this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
    this.inputShipCardsPerRow = this.settingsData.settings['ship-cards-per-row'];
    
    this.initialSettings = JSON.parse(JSON.stringify(this.settingsData.settings))
  }

  resetSite() {
    this.prompt.openConfirmation(this.modalIndex, "RESET SITE", "All ship data and settings preferences will be deleted. Proceed?")
      .then(isYes => {
        if(isYes) {
          this.shipsService.ships = [];
          this.storage.remove("ships");
          this.storage.remove('USS');
          this.storage.remove('HMS');
          this.storage.remove('KMS');
          this.storage.remove('IJN');
          this.settingsData.settings = JSON.parse(JSON.stringify(this.settingsData.defaultSettings));
          this.confirmedChanges = true;
          this.misc.uiMode = this.settingsData.settings['ui-mode']

          this.settingsData.save();
          this.azurapi.init();
          this.exit();
        }
      })
  }

  importCSV(event) {
    this.csv.import(event.target['files'][0]);
  }

  openCredits() {
    this.prompt.openAnotherPrompt(this.modalIndex, CreditsComponent);
  }

  async save() {
    this.confirmedChanges = true;

    this.settingsData.save();

    await this.settingsData.refresh().then(() => {
      this.misc.uiMode = <"Icon" | 'Sheet'>this.settingsData.settings['ui-mode'];
    })

    this.misc.refreshIconList();
    this.filter.filter();
    
    this.modalController.dismiss();
  }

  exit() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.importedCsvSubscription.unsubscribe();
    this.prompt.exit();
    if(!this.confirmedChanges) {
      Object.keys(this.initialSettings).forEach(setting => {
        this.storage.set(setting, this.initialSettings[setting]);
      })
    }
  }
}
