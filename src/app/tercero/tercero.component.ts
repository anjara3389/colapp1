import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.scss'],
})
export class TerceroComponent implements OnInit {

  dataForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.dataForm = this.createForm();
  }

  ngOnInit() { }

  private createForm() {
    return this.formBuilder.group({
      nombres: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono1: ['', Validators.required],
      telefono2: [''],
      mail: ['', Validators.required],
    });
  }

  sendData() {
    console.log(this.dataForm.value);
  }

}
