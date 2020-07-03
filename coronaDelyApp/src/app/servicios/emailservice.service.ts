import { Injectable } from '@angular/core';
import { Elementos } from '../clases/enums/elementos';
import { EmailPlantilla } from '../clases/email-plantilla';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private emailTemplatesCollection = Elementos.EmailPlantilla;
  private email: EmailPlantilla;

  constructor(private http: HttpClient,
    private dataService: DataService) {
  }

  sendAprovalEmail(destinationEmailAddress: string) {

    this.getEmailTemplateById('YeYzySy0pkZSOhC5scsb').then(emailTemplate => {
      this.email = Object.assign(new EmailPlantilla, emailTemplate.data());

      let auxEmail =
      {
        "to": destinationEmailAddress,
        "subject": this.email.subject,
        "html": this.email.html
      }

      this.http.post<any>('https://us-central1-elementales-4394b.cloudfunctions.net/mailer', auxEmail).subscribe(data => {
        console.log(data);
      })
    });
  }


  getEmailTemplateById(emailTemplateId) {
    return this.dataService.getOne(this.emailTemplatesCollection, emailTemplateId);
  }


}