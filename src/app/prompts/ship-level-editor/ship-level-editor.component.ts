import { AfterContentChecked, AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';

@Component({
  selector: 'app-ship-level-editor',
  templateUrl: './ship-level-editor.component.html',
  styleUrls: ['./ship-level-editor.component.scss'],
})
export class ShipLevelEditorComponent implements OnInit, AfterViewChecked {

  @Input() name: string;
  @Input() level: number;

  @ViewChild('input') input: IonInput;

  constructor(private prompt: PromptService, private modalController: ModalController) { }

  ngOnInit() {
    this.prompt.init(250);
  }

  ngAfterViewChecked() {
    this.input.setFocus();
  }

  exit() {
    this.modalController.dismiss();
  }

  done() {
    this.modalController.dismiss(this.input.value);
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
