import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FactionTechLevelEditorComponent } from 'src/app/prompts/faction-tech-level-editor/faction-tech-level-editor.component';
import { FactionTechDataService } from 'src/app/services/faction-tech-data.service';
import { FleetTechService } from 'src/app/services/fleet-tech.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-tech-summary',
  templateUrl: './tech-summary.component.html',
  styleUrls: ['./tech-summary.component.scss', '../home.page.scss'],
})
export class TechSummaryComponent implements OnInit {

  objectKeys = Object.keys;

  // full faction name; shorthand is always gotten from shortenedNames
  viewingFaction: string;

  folded = {
    "total": false,
    "max": false,
    "obtain": false
  }

  fullNames = {
    "USS": "Eagle Union",
    "HMS": "Royal Navy",
    "IJN": "Sakura Empire",
    "KMS": "Iron Blood"
  }

  constructor(
    private factionTechData: FactionTechDataService, 
    public hoverTitles: HoverTitlesService, 
    private modalController: ModalController, 
    private storage: Storage,
    public misc: MiscService,
    public fleetTech: FleetTechService
  ) { }

  async ngOnInit() {
    this.fleetTech.refresh();
  }

  async openFactionTech(name: string) {
    // open level editor if faction level is 0
    if(!this.factionTechData.levels[name] || this.factionTechData.levels[name] == 0) {
      this.viewingFaction = name;
      this.changeLevel();
      return;
    }

    if(this.viewingFaction == name) {
      this.viewingFaction = null;
    } else {
      this.viewingFaction = name;
    }
  }

  async changeLevel() {
    const modal = await this.modalController.create({
      component: FactionTechLevelEditorComponent,
      animated: false,
      componentProps: {
        "fullFactionName": this.fullNames[this.viewingFaction],
        "techPoints": this.fleetTech[`points${this.viewingFaction}`]
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      if(value.data != null) {
        this.factionTechData.levels[this.viewingFaction] = value.data;
        this.storage.set(this.viewingFaction, value.data);
      }

      this.fleetTech.refresh();
    })
  }

  toggleFold(type: string) {
    this.folded[type] = !this.folded[type];
  }
}
