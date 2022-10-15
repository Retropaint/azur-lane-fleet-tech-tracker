import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { FactionTechLevelEditorComponent } from 'src/app/prompts/faction-tech-level-editor/faction-tech-level-editor.component';
import { FactionTechDataService } from 'src/app/services/faction-tech-data.service';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';
import { MiscService } from 'src/app/services/misc.service';
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
  viewingFactionLevel: number;
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
    private shipsService: ShipsService,
    public misc: MiscService
  ) { }

  async ngOnInit() {
    // load levels and respective faction stats
    const factions = ['USS', 'HMS', 'IJN', 'KMS']
    for(const faction of factions) {
      this.levels[faction] = await this.storage.get(faction) || 0;
      this.factionTechData.getTotalStats(faction, this.levels[faction]);
      this.getFactionTech(faction, this.levels[faction]);
    }

    // get obtain and collection stats
    this.shipsService.ships.forEach(ship => {
      if(ship.techStat == null) {
        return;
      }

      // obtain
      if(ship.isObtained) {
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
      if(ship.isObtained && ship.level >= 120) {
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

  async openFactionTech(fullFaction: string) {
    // open level editor if faction level is 0
    const level = await this.storage.get(this.shortenedNames.factions[fullFaction])
    this.viewingFactionLevel = level;
    if(!level || level == 0) {
      this.viewingFaction = fullFaction;
      this.setViewingFactionStats();
      this.changeLevel();
      return;
    }

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
        this.viewingFactionLevel = value.data;
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
    switch(shortFaction) {
      case "USS":
        this.ussStats = this.factionTechData.getTotalStats('USS', level);
      break; case "HMS":
        this.hmsStats = this.factionTechData.getTotalStats('HMS', level);
      break; case "IJN":
        this.ijnStats = this.factionTechData.getTotalStats('IJN', level);
      break; case "KMS":
        this.kmsStats = this.factionTechData.getTotalStats('KMS', level);;
      break;
    }
  }

  getTotalStats() {
    // reset
    this.totalStats = {};
    
    const stats = [this.ussStats, this.hmsStats, this.ijnStats, this.kmsStats, this.obtainStats, this.techStats];
    stats.forEach(statSet => {
      if(Object.keys(statSet).length == 0) {
        return;
      }
      Object.keys(statSet).forEach(hull => {
        if(hull == 'DDG') {
          return;
        }
        if(this.totalStats[hull] == null) {
          this.totalStats[hull] = {};
        }
        Object.keys(statSet[hull]).forEach(stat => {
          if(this.totalStats[hull][stat] == null) {
            this.totalStats[hull][stat] = statSet[hull][stat]
          } else {
            this.totalStats[hull][stat] += statSet[hull][stat]
          }
        })
      })
    })
  }

  toggleFold(type: string) {
    this.folded[type] = !this.folded[type];
  }
}
