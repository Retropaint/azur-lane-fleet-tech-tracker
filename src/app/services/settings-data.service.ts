import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsDataService {

  defaultSettings = {
    'ui-mode': "Icon",
    'retrofit-forms': "No",
    'ship-cards-per-row': 6,
    "show-no-tech-ships": null
  }

  settings = JSON.parse(JSON.stringify(this.defaultSettings));

  initialSettings = {};

  constructor(private storage: Storage) {}

  async refresh() {
    for(const setting of Object.keys(this.settings)) {
      const storageValue = await this.storage.get(setting);
      if(storageValue) {
        this.settings[setting] = storageValue;
      }
    }
  }

  async save() {
    Object.keys(this.settings).forEach(setting => {
      this.storage.set(setting, this.settings[setting]);
    })
  }

  checkBool(setting: 'retrofit-forms' | 'show-no-tech-ships') {
    return this.settings[setting] == "Yes";
  }
}
