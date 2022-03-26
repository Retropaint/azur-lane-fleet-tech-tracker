import { Component, HostBinding, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { FilterService } from 'src/app/services/filter.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { ShipCategory } from 'src/app/interfaces/ship-category';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss'],
})
export class CategoryEditorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('input') input: IonInput;
  @Input('selectedCategory') selectedCategory: string; 
  error: string;
  modalIndex: number = 0;

  constructor(private modalController: ModalController, 
    private shipCategoryData: ShipCategoryDataService, 
    private filter: FilterService, 
    private prompt: PromptService) { }

  ngAfterViewInit() {
    this.modalIndex = this.prompt.init(300);
  }

  exit() {
    this.modalController.dismiss('cancelled');
  }

  done() {
    if(this.selectedCategory == null) {
      this.create();
    } else {
      this.edit();
    }
    this.shipCategoryData.save();
  }

  async delete() {
    document.getElementById('ion-overlay-' + this.modalIndex).setAttribute('style', 'display: none');
    const modal = await this.modalController.create({
      component: ConfirmationComponent,
      animated: false,
      backdropDismiss: false, // closing from backdrop closes editor as well
      componentProps: {
        "title": "DELETE CATEGORY",
        "body": "Are you sure you want to delete " + this.selectedCategory + "?"
      }
    })
    modal.present();
    modal.onDidDismiss().then(value => {
      document.getElementById('ion-overlay-' + this.modalIndex).setAttribute('style', '');
      if(value.data == true) {
        // decrement id's past the deleted category's to keep them in line
        const id = this.shipCategoryData.categories[this.selectedCategory].sortId;
        this.shipCategoryData.newCategory("Binned Ships");
        this.shipCategoryData.categories["Binned Ships"].ships = this.shipCategoryData.categories[this.selectedCategory].ships;
        this.shipCategoryData.decrementSortIds(id);

        delete this.shipCategoryData.categories[this.selectedCategory];
        this.shipCategoryData.selectedCategory = this.shipCategoryData.sortedCategoryNames[0];
        this.shipCategoryData.sort();
        this.shipCategoryData.save();
        this.modalController.dismiss();
      }
    })
  }

  edit() {
    // close if name hasn't changed
    if(this.selectedCategory != null && this.input.value == this.selectedCategory) {
      this.modalController.dismiss();
      return;
    }

    if(!this.isNameAcceptable()) {
      return;
    }

    // duplicate selected category with a different key and title, and delete old one
    this.shipCategoryData.categories[this.input.value] = this.shipCategoryData.categories[this.selectedCategory];
    this.shipCategoryData.categories[this.input.value].title = this.input.value;
    delete this.shipCategoryData.categories[this.selectedCategory];
    
    this.shipCategoryData.selectedCategory = this.input.value.toString();
    this.shipCategoryData.sort();
    this.filter.filter();

    this.modalController.dismiss();
  }

  create() {
    if(this.isNameAcceptable()) {
      this.shipCategoryData.newCategory(this.input.value.toString());
      this.modalController.dismiss('created');
    }
  }

  isNameAcceptable(): boolean {

    switch(this.input.value) {
      case "+":
        this.setError("Trying to be clever, huh?");
        return false;
      case "": case null:
        this.setError("Enter a name!");
        return false;
      case "Retrieved Ships":
        this.setError("This name is reserved.");
        return false;
    }

    let isUniqueName = true;
    Object.keys(this.shipCategoryData.categories).forEach(category => {
      if(category == this.input.value) {
        isUniqueName = false;
        return;
      }
    })
    if(!isUniqueName) {
      this.setError("Another category already uses this name!")
      return false;
    }
    return true;
  }

  async open(selectedCategory: string = null) {
    const modal = await this.modalController.create({
      component: CategoryEditorComponent,
      showBackdrop: false,
      animated: false,
      componentProps: {
        'selectedCategory': selectedCategory
      }
    })
    modal.present();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }

  setError(error: string) {
    this.error = error;
    if(this.selectedCategory != null) {
      this.prompt.changeHeight(350);
    }
  }
}
