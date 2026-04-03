import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-commitment',
  imports: [FooterComponent],
  templateUrl: './commitment.html',
  styleUrl: './commitment.scss',
})
export class CommitmentComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
