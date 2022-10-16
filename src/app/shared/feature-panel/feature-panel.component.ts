import { Component, Input } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-feature-panel',
  templateUrl: './feature-panel.component.html',
  styleUrls: ['./feature-panel.component.scss', '../../home/home.page.scss'],
})
export class FeaturePanelComponent {

  @Input() uiMode: string;

  constructor(
    public misc: MiscService,
    private modalController: ModalController,
    private shipsService: ShipsService,
    private menuController: MenuController
  ) { }

  toggleBulkSelect() {
    this.misc.usedBulkSelectEditAll = false;
    this.misc.isBulkSelect = !this.misc.isBulkSelect;
    if(!this.misc.isBulkSelect && this.misc.bulkSelected.length > 0) {
      this.openLevelEditor();
    }
  }

  editAllShips() {
    this.misc.usedBulkSelectEditAll = true;
    this.shipsService.ships.forEach(ship => {
      if(this.misc.shipsFilterPass[ship.id]) {
        this.misc.bulkSelected.push(ship);
      }
    })
    this.openLevelEditor();
  }

  selectAllShips() {
    let allShips = true;
    for(let toggle of Object.keys(this.misc.shipsFilterPass)) {
      if(this.misc.shipsFilterPass[toggle]) {
        allShips = false;
        break;
      }
    }

    this.shipsService.ships.forEach(ship => {
      if(this.misc.shipsFilterPass[ship.id] || allShips) {
        ship.isBulkSelected = true;
        this.misc.bulkSelected.push(ship);
      }
    })
  }

  cancelBulkSelect() {
    this.misc.isBulkSelect = false;
    this.misc.bulkSelected.forEach(ship => {
      ship.isBulkSelected = false;
    })
    this.misc.bulkSelected = [];
  }

  async openLevelEditor() {
    const modal = await this.modalController.create({
      component: ShipLevelEditorComponent,
      animated: false,
      componentProps: {
        'isBulk': true
      }
    })
    modal.present();
  }

  closeMenu() {
    this.menuController.close('filter')
  }
}
