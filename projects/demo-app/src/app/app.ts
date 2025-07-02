import { Component, OnInit } from '@angular/core';
import { AddressAutocompleteComponent, Address } from 'hls-address';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    AddressAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
})
export class App implements OnInit {
  protected title = 'demo-app';
  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      accept: new FormControl(false),
      address: new FormControl<Address | null>(null),
    });
  }

  get address(): Address | null {
    return this.form.get('address')?.value || null;
  }
}
