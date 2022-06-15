import { Injectable } from '@angular/core';

import { Component, OnInit } from '@angular/core';

import { ApiGatewayService } from './apigw.service';

import { FormControl, 
	 FormGroup, 
	 FormBuilder,
	 FormArray,
	 ValidatorFn
} from '@angular/forms'

import { Observable } from 'rxjs';

@Component({
  selector: 'app-dbdinv',
  templateUrl: './dbdinv.component.html',
  styleUrls: ['./dbdinv.component.css']
})

@Injectable()


export class DashboardInventory implements OnInit{

  boolForm: FormGroup;
  boolOptions : any = [
    "true",
    "false"
  ];

  esVersions : any = [
    "1.0.1",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.1.0"
  ]

  constructor(private apigwService: ApiGatewayService, private fb: FormBuilder) {
    this.boolForm = this.fb.group({boolControl: ['false']});
  }

  defaultObject : any = {
    abbrv: '',
    dns_hostname: '',
    description: '',
    source_ips: ['0.0.0.0/0'],
    main_deployment: 'false',
    es_total_ver: '2.1.0',
    assets_quantity: '',
    rabbitmq_crt: '',
    rabbitmq_key: ''
  };

  newAgencyForm = this.fb.group(
    this.defaultObject
  );

  curAgencyForm = this.fb.group([]);

  working_inv : any = [ ];
  verifier : boolean = false;
  other_inv : any = [];
  modifications: any = [];

  toggleForm: boolean = false;
  toggleDb: boolean = true;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apigwService.getInventory()
      .subscribe(
      response => {
	      this.working_inv=JSON.parse(response);
      },
      error => {
	      console.log(error);
      },
      () => {
        console.log('complete');
      }
    );
  }

  delRow(x: any): void {
    if(confirm("Are you sure you want to delete "+x.abbrv+" - "+x.description)) {
      for(let i = 0 ; i < this.working_inv.length ;  ++i) {
        if (this.working_inv[i] === x) {
          this.working_inv.splice(i,1);
	  if (!this.modifications.includes(x.abbrv+"-"+x.es_ver)) {
            this.modifications.push(x.abbrv+"-"+x.es_ver);
	  }
        }
      }
      this.verifier = true;
    }
    else {
      return;
    }
  }

  addSubmit(): void {
    const abbrv = this.newAgencyForm.value.abbrv.toLowerCase();
    var current_total_ver : string;
    var m_depl: boolean = false;
    if ( this.newAgencyForm.value.main_deployment == 'true' ){
      m_depl = true
    }
    // Regular Verifications
    if (!this.newAgencyForm.value.abbrv) {
      alert('No value was provided to Agency Abbreviation');
      return;
    }
    if (!this.newAgencyForm.value.assets_quantity){
      alert('Assets Quantity is not a number');
      return;
    }
    // Comparing Verifications
    for(let i = 0 ; i < this.working_inv.length ; ++i) {
      current_total_ver = this.working_inv[i].es_ver + "." + this.working_inv[i].es_minor_ver + "." + this.working_inv[i].es_patch_ver;
      if (this.working_inv[i].abbrv == abbrv){
	if (current_total_ver == this.newAgencyForm.value.es_total_ver) {
	  alert('The Agency abbreviation '+abbrv+' with version ' + current_total_ver + ' already exists.');
	  return;
	}
	if (this.working_inv[i].main_deployment && m_depl) {
	  alert('Agency '+abbrv+' version ' + current_total_ver + ' is already set as a main deployment.');
	  return;
	}
      }
    }
    this.working_inv.push({ 
      abbrv: abbrv,
      dns_hostname: this.newAgencyForm.value.dns_hostname,
      description: this.newAgencyForm.value.description,
      source_ips: this.newAgencyForm.value.source_ips,
      main_deployment: m_depl,
      es_ver: this.newAgencyForm.value.es_total_ver.split(".",3)[0],
      es_minor_ver: this.newAgencyForm.value.es_total_ver.split(".",3)[1],
      es_patch_ver: this.newAgencyForm.value.es_total_ver.split(".",3)[2],
      assets_quantity: this.newAgencyForm.value.assets_quantity,
      rabbitmq_crt: this.newAgencyForm.value.rabbitmq_crt,
      rabbitmq_key: this.newAgencyForm.value.rabbitmq_key
    })
    if ( !this.modifications.includes(abbrv+"-"+this.newAgencyForm.value.es_total_ver.split(".",3)[0])) {
      this.modifications.push(abbrv+"-"+this.newAgencyForm.value.es_total_ver.split(".",3)[0]);
    }
    this.newAgencyForm = this.fb.group(this.defaultObject);
    this.verifier = true;
  }

  editRow(event: any, id: any , attribute: any): void {
    switch(attribute) {
      case 'total_ver': {
        const editField = event.target.value;
        this.working_inv[id]['es_ver'] = editField.split(".",3)[0];
        this.working_inv[id]['es_minor_ver'] = editField.split(".",3)[1];
        this.working_inv[id]['es_patch_ver'] = editField.split(".",3)[2];
        break;
      }
      case 'main_deployment': {
        const editField = event.target.value;
        if ( editField == 'true' ) {
          this.working_inv[id][attribute] = true;
        }
        else {
          this.working_inv[id][attribute] = false;
        }
        break;
      }
      case 'assets_quantity': {
        const editField = event.target.textContent;
	if ( +editField == this.working_inv[id][attribute] ){
          return;
	}
        this.working_inv[id][attribute] = +editField;
        break;
      }
      default: {
        const editField = event.target.textContent;
	if ( editField == this.working_inv[id][attribute] ) {
          return;
	}
        this.working_inv[id][attribute] = editField;
	break;
      }
    }
    this.verifier = true;
    if ( !this.modifications.includes(this.working_inv[id]['abbrv']+"-"+this.working_inv[id]['es_ver'])) {
      this.modifications.push(this.working_inv[id]['abbrv']+"-"+this.working_inv[id]['es_ver']);
    }
  }

  saveEntries(): void{
    var result: any;
    var wentbad: any;
    if ( !this.verifier ) {
      alert('No changes detected');
      return;
    }
    for(let i = 0 ; i < this.working_inv.length ; ++i) {
      if ( ! this.working_inv[i].assets_quantity ) {
         alert("Assets quantity under " + 
	       this.working_inv[i].abbrv + "-" + 
	       this.working_inv[i].es_ver + "." + 
	       this.working_inv[i].es_minor_ver + "." + 
	       this.working_inv[i].es_patch_ver +
	       " should be a number");
	 return;
      }
      for(let y = i+1 ; y < this.working_inv.length ; ++y) {
        if ( this.working_inv[i].abbrv == this.working_inv[y].abbrv ) {
	  if ( this.working_inv[i].main_deployment == this.working_inv[y].main_deployment ) {
            alert("The Agency " + this.working_inv[i].abbrv + " can only have one Main Deployment")
	    return;
	  }
	  if ( this.working_inv[i].es_ver == this.working_inv[y].es_ver &&
	       this.working_inv[i].es_minor_ver == this.working_inv[y].es_minor_ver &&
	       this.working_inv[i].es_patch_ver == this.working_inv[y].es_patch_ver ) {
            alert("The Agency " + this.working_inv[i].abbrv + " has a duplicated ES version")
	    return;
	  }
	}
      }
    }
    if(confirm("Are you sure you want to make the following modifications?:\n\n"+this.modifications)) {
      this.apigwService.postInventory(this.working_inv)
        .subscribe(
          res=>{
            this.other_inv=res;
	    if (this.other_inv['ResponseMetadata']['HTTPStatusCode'] == 200 ) {
              alert('Successful push!');
	      window.location.reload();
	    }
	    else {
              alert('The push failed');
	    }
          }
        );
    }
    else {
      return;
    }
  }

  togglingForm() {
    this.toggleForm = !this.toggleForm;
  }
  togglingDb() {
    this.toggleDb = !this.toggleDb;
  }
}
