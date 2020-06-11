import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPreviewModalComponent } from './member-preview-modal.component';

describe('MemberPreviewModalComponent', () => {
  let component: MemberPreviewModalComponent;
  let fixture: ComponentFixture<MemberPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPreviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
