import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsDataService {

  settings = {
    'ui-mode': "UI",
    'retrofit-forms': "No",
    'ship-cards-per-row': 5
  }

  constructor(private storage: Storage) {}

  async refresh() {
    for(const setting of Object.keys(this.settings)) {
      const storageValue = await this.storage.get(setting);
      if(storageValue) {
        this.settings[setting] = storageValue
      }
    }
  }
}
