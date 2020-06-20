import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCredentialsComponent } from './edit-credentials.component';

describe('EditCredentialsComponent', () => {
  let component: EditCredentialsComponent;
  let fixture: ComponentFixture<EditCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
