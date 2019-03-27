import { Component, OnInit } from '@angular/core';
import { WservConnectService } from '../wserv-connect.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  respuesta:String;

  constructor(public wServConnectService: WservConnectService) { 

  }

  ngOnInit() {

  }

  sumar(){
    
  var observ=this.wServConnectService.post("SELECT * FROM usuarios u WHERE u.usuario='AROSERO'");
  
  observ.subscribe(data=>{
    
    
    console.log("ESTE ES EL RESULTADO",data);
    this.respuesta=data[0]['des_usuario'];
  }); 
    //console.log("JSON ESTEEEEEE",JSON.stringify(json));
  }
}
