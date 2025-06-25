import { Component, OnInit } from '@angular/core';
import {
  AddressAutocompleteComponent,
  Address,
  AddressForm,
} from 'hls-address';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    CommonModule,
    AddressAutocompleteComponent,
    AddressForm,
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox
  ]
})
export class App implements OnInit {
  protected title = 'demo-app';
  form1!: FormGroup;
  form2!: FormGroup;

  ngOnInit() {
    this.form1 = new FormGroup({
      accept: new FormControl(false),
      address: new FormControl<Address | null>({value: null, disabled: false}),
    });
    this.form2 = new FormGroup({
      accept: new FormControl(false),
      address: new FormControl<Address | null>({value: null, disabled: false}),
    });
  }

  get address1(): Address | null {
    return this.form1.get('address')?.value || null;
  }

  get address2(): Address | null {
    return this.form2.get('address')?.value || null;
  }
}
