import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


export class Api{
  constructor(
    public id:string,
    public name:String,
    public ApplicationName:string,
    public state:String,
    public ids:String,
    public action:String
  ){}
}

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  apis!: Api[]; 
  closeResult!:string;
  api!:Api;
  api1!:Api;
  editForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private modalService:NgbModal,
    private fb: FormBuilder
    ) { }
    
  ngOnInit(): void {
    this.getApiData();
    this.editForm = this.fb.group({
      id: [''],
      action:['']
    });
  }

  getApiData(){  
     this.httpClient.get<any>('https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2').subscribe(
       response => {
        if (Response) {
          hideloader();
      }
         console.log(response);  
         this.apis = response;
        }       
     ); 
     function hideloader() {
      console.log('testing')
      // Setting display of spinner
      // element to none
      document.getElementById('loading')!.hidden = true;
      console.log('testing1')
  }  
   }


   openEdit(targetModal:any, api: Api) {
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'md'
    });
    this.editForm.patchValue( {
      id: api.id, 
      action: api.state == 'running'?'stop':'start',
     
    });
  }

  

//start all

startAll(e:any) {
  const body = { action: 'start',id: e.target.value};
    this.httpClient.post<any>('https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2', body)
        .subscribe((result) => {
          this.ngOnInit();
        });

}

startAllInstance(){
  const body = { action: 'start',id: 'all'};
    this.httpClient.post<any>('https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2', body)
        .subscribe((result) => {
          this.ngOnInit();
        });
        
}

stopAll(e:any){
  const body = { action: 'stop',id: e.target.value};
    this.httpClient.post<any>('https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2', body)
        .subscribe((result) => {
          this.ngOnInit();
        });
}
stopAllInstance(){
  const body = { action: 'stop',id: 'all'};
    this.httpClient.post<any>('https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2', body)
        .subscribe((result) => {
          this.ngOnInit();
        });
        
}


refreshPage(){
  this.ngOnInit();
}


//start all end








  onSave(){
    const url = 'https://3d3zn5urxi.execute-api.us-east-2.amazonaws.com/testing/ec2';
    this.httpClient.post(url,this.editForm.value)    
    .subscribe((result) => {
      this.ngOnInit();
    });
    // setTimeout(() => 
    // {
    //   this.modalService.dismissAll();
    // },
    // 9000);
    this.modalService.dismissAll(); //dismiss the modal

  }


  



   open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
