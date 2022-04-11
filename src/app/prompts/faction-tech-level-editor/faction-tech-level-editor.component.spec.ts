import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FactionTechLevelEditorComponent } from './faction-tech-level-editor.component';

describe('FactionTechLevelEditorComponent', () => {
  let component: FactionTechLevelEditorComponent;
  let fixture: ComponentFixture<FactionTechLevelEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FactionTechLevelEditorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FactionTechLevelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
