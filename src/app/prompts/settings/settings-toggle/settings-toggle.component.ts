import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.scss'],
})
export class SettingsToggleComponent implements OnInit {

  @Input() name: string;
  @Input() trueToggle: string;
  @Input() falseToggle: string;
  @Input() storageName: string;
  @Input() defaultState: boolean;

  toggle: boolean;

  constructor(private storage: Storage) {}

  async ngOnInit() {
    const storageToggle = await this.storage.get(this.storageName)
    if(storageToggle != null) {
      this.toggle = storageToggle;
    } else {
      this.toggle = this.defaultState;
    }
  }

  setToggle(toggle: boolean) {
    this.toggle = toggle;
    this.storage.set(this.storageName, toggle);
  }
}
