import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FactionTechLevelEditorComponent } from 'src/app/prompts/faction-tech-level-editor/faction-tech-level-editor.component';
import { FactionTechDataService } from 'src/app/services/faction-tech-data.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { ShipsService } from 'src/app/services/ships.service';
import { ShortenedNamesService } from 'src/app/services/shortened-names.service';

@Component({
  selector: 'app-tech-summary',
  templateUrl: './tech-summary.component.html',
  styleUrls: ['./tech-summary.component.scss', '../home.page.scss'],
})
export class TechSummaryComponent implements OnInit {

  objectKeys = Object.keys;

  // full faction name; shorthand is always gotten from shortenedNames
  viewingFaction: string;

  viewingFactionStats: any;
  ussStats = {};
  hmsStats = {};
  ijnStats = {};
  kmsStats = {};

  obtainStats = {};
  techStats = {};
  totalStats = {};

  levels = {
    "USS": 0,
    "HMS": 0,
    "IJN": 0,
    "KMS": 0
  }

  folded = {
    "total": false,
    "max": false,
    "obtain": false
  }

  constructor(private factionTechData: FactionTechDataService, 
    public hoverTitles: HoverTitlesService, 
    private modalController: ModalController, 
    private shortenedNames: ShortenedNamesService,
    private storage: Storage,
    private shipsService: ShipsService) { }

  async ngOnInit() {
    // load levels and respective faction stats
    const factions = ['USS', 'HMS', 'IJN', 'KMS']
    for(const faction of factions) {
      this.levels[faction] = await this.storage.get(faction) || 1;
      this.getFactionTech(faction, this.levels[faction]);
    }

    // get obtain and collection stats
    this.shipsService.ships.forEach(ship => {
      // obtain
      if(!ship.isIgnored) {
        ship.appliedHulls.forEach(hull => {
          if(hull == 'DDG') {
            return;
          }
          if(this.obtainStats[hull] == null) {
            this.obtainStats[hull] = {};
          }
          if(this.obtainStats[hull][ship.obtainStat] == null) {
            this.obtainStats[hull][ship.obtainStat] = ship.obtainBonus
          } else {
            this.obtainStats[hull][ship.obtainStat] += ship.obtainBonus
          }
        })
      }

      // max
      if(!ship.isIgnored && ship.level >= 120) {
        ship.appliedHulls.forEach(hull => {
          if(hull == 'DDG') {
            return;
          }
          if(this.techStats[hull] == null) {
            this.techStats[hull] = {};
          }
          if(this.techStats[hull][ship.techStat] == null) {
            this.techStats[hull][ship.techStat] = ship.techBonus
          } else {
            this.techStats[hull][ship.techStat] += ship.techBonus
          }
        })
      }
    })

    this.getTotalStats();
  }

  openFactionTech(fullFaction: string) {
    if(this.viewingFaction == fullFaction) {
      this.viewingFaction = null;
    } else {
      this.viewingFaction = fullFaction;
      this.setViewingFactionStats();
    }
  }

  async changeLevel() {
    const modal = await this.modalController.create({
      component: FactionTechLevelEditorComponent,
      animated: false,
      componentProps: {
        "fullFactionName": this.viewingFaction,
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      if(value.data != null) {
        const shortFaction = this.shortenedNames.factions[this.viewingFaction]

        this.levels[shortFaction] = value.data;
        this.storage.set(shortFaction, value.data);
        this.getFactionTech(shortFaction, this.levels[shortFaction]);
        this.setViewingFactionStats();
        this.getTotalStats();
      }
    })
  }

  setViewingFactionStats() {
    switch(this.shortenedNames.factions[this.viewingFaction]) {
      case "USS":
        this.viewingFactionStats = this.ussStats;
      break;case "HMS":
        this.viewingFactionStats = this.hmsStats;
      break;case "IJN":
        this.viewingFactionStats = this.ijnStats;
      break;case "KMS":
        this.viewingFactionStats = this.kmsStats;
      break;
    }
  }

  getFactionTech(shortFaction: string, level: number) {
    let factionData = null;
    let factionStats = null;
    switch(shortFaction) {
      case "USS":
        this.ussStats = {}; // reset faction stat to prevent lingering hulls that shouldn't exist in a level
        factionData = this.factionTechData.USS;
        factionStats = this.ussStats;
      break; case "HMS":
        this.hmsStats = {};
        factionData = this.factionTechData.HMS;
        factionStats = this.hmsStats;
      break; case "IJN":
        this.ijnStats = {};
        factionData = this.factionTechData.IJN;
        factionStats = this.ijnStats;
      break; case "KMS":
        this.kmsStats = {};
        factionData = this.factionTechData.KMS;
        factionStats = this.kmsStats;
      break;
    }

    for(let i = 1; i < level+1; i++) {
      // level doesn't exist, stop
      if(factionData[i] == null) {
        break;
      }

      // add or replace hull with its stats
      for(const hull of Object.keys(factionData[i])) {
        if(hull == 'DDG') {
          continue;
        }
        factionStats[hull] = factionData[i][hull];
      }
    }
  }

  getTotalStats() {
    // reset
    this.totalStats = {};
    
    const factionStats = [this.ussStats, this.hmsStats, this.ijnStats, this.kmsStats, this.obtainStats, this.techStats];
    factionStats.forEach(faction => {
      Object.keys(faction).forEach(hull => {
        if(hull == 'DDG') {
          return;
        }
        if(this.totalStats[hull] == null) {
          if(this.totalStats[hull] == null) {
            this.totalStats[hull] = {};
          }
        }
        Object.keys(faction[hull]).forEach(stat => {
          if(this.totalStats[hull][stat] == null) {
            this.totalStats[hull][stat] = faction[hull][stat]
          } else {
            this.totalStats[hull][stat] += faction[hull][stat]
          }
        })
      })
    })
  }

  toggleFold(type: string) {
    this.folded[type] = !this.folded[type];
  }
}
