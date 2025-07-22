import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctores } from './admin-doctores';

describe('AdminDoctores', () => {
  let component: AdminDoctores;
  let fixture: ComponentFixture<AdminDoctores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDoctores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
