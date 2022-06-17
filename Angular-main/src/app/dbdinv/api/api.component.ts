import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  url!: string
  platform!: string | null;
  apis!: Api[]; 
  closeResult!:string;
  api!:Api;
  api1!:Api;
  editForm!: FormGroup;
  
  constructor(
    private httpClient: HttpClient,
    private modalService:NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute
    ) { }
    
  ngOnInit(): void {
    document.getElementById('loader')!.style.display = 'block';

    // defining api url as per the environment
    // this.route.queryParams.subscribe(params => {
    //   this.platform = params['platform'];
    // });
    this.platform = this.route.snapshot.paramMap.get('platform');
    if(this.platform == 'prod'){
      this.url = 'https://ywpvbvwhfa.execute-api.us-east-2.amazonaws.com/prod/manage-ec2'
    }
    else{
     this.url = 'https://3d3zn5urxi.execute-api.us-east-2.amazonaws.com/testing/ec2'
    }
    console.log(this.url)

    this.getApiData();
    this.editForm = this.fb.group({
      id: [''],
      action:['']
    });
  }

  getApiData(){  
    console.log(this.url)
     this.httpClient.get<any>(this.url).subscribe(
       response => {
        if (Response) {
          hideloader();
      }  
         this.apis = response;
        }       
     ); 
     function hideloader() {
        document.getElementById('loader')!.style.display = 'none'
  }  
   }


   openEdit(targetModal:any, api: Api): void {
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
  console.log(this.url);
  const body = { action: 'start',id: e.target.value};
    this.httpClient.post<any>(this.url, body)
        .subscribe((result) => {
          this.ngOnInit();
        });

}

startAllInstance(){
  console.log(this.url);
  const body = { action: 'start',id: 'all'};

    this.httpClient.post<any>(this.url, body)
        .subscribe((result) => {
          this.ngOnInit();
        });
        
}

stopAll(e:any){
  console.log(this.url);
  const body = { action: 'stop',id: e.target.value};
  
    this.httpClient.post<any>(this.url, body)
        .subscribe((result) => {
          this.ngOnInit();
        });
}
stopAllInstance(){
  console.log(this.url);
  const body = { action: 'stop',id: 'all'};
 
    this.httpClient.post<any>(this.url, body)
        .subscribe((result) => {
          this.ngOnInit();
        });
        
}


refreshPage(){
  console.log(this.url);
  this.ngOnInit();
}


//start all end








  onSave(){
    console.log(this.url)
    this.httpClient.post(this.url,this.editForm.value)    
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
