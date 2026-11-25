import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneDetailsViewComponent } from './milestone-details-view.component';

describe('MilestoneDetailsViewComponent', () => {
  let component: MilestoneDetailsViewComponent;
  let fixture: ComponentFixture<MilestoneDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneDetailsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
