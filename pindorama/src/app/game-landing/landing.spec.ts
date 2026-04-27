import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';

import { LandingComponent } from './landing';

describe('GameLandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
  });

  it('routes the top-right sign up button to the signup page', () => {
    const signUpLink = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .find(link => link.nativeElement.textContent.trim() === 'Sign Up');

    expect(signUpLink).toBeDefined();
    expect(signUpLink?.injector.get(RouterLink).routerLink).toBe('/signup');
  });

  it('routes the login links to the login page', () => {
    const loginLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .filter(link => link.nativeElement.textContent.trim() === 'Log In');

    expect(loginLinks).toHaveLength(2);
    expect(loginLinks.every(link => link.injector.get(RouterLink).routerLink === '/login')).toBe(true);
  });
});
