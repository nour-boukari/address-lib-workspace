import { Component, OnInit } from '@angular/core';
import {
  AddressAutocompleteComponent,
  Address,
} from 'hls-address';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    CommonModule,
    AddressAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class App implements OnInit {
  protected title = 'demo-app';
  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      accept: new FormControl(false),
      address: new FormControl<Address | null>({value: null, disabled: false}, Validators.required),
    });
  }

  get address(): Address | null {
    return this.form.get('address')?.value || null;
  }
}
