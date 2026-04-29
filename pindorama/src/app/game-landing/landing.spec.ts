import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterLink, provideRouter } from '@angular/router';

import { LandingComponent } from './landing';

describe('GameLandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('routes the top-right sign up button to the signup page', () => {
    const signUpLink = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .find(link => link.nativeElement.textContent.trim() === 'Sign Up');

    expect(signUpLink).toBeDefined();
    expect(router.serializeUrl(signUpLink!.injector.get(RouterLink).urlTree!)).toBe('/signup');
  });

  it('routes the login links to the login page', () => {
    const loginLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .filter(link => link.nativeElement.textContent.trim() === 'Log In');

    expect(loginLinks).toHaveLength(2);
    expect(loginLinks.every(link => router.serializeUrl(link.injector.get(RouterLink).urlTree!) === '/login')).toBe(true);
  });
});
