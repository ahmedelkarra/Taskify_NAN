import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInfoService } from './user-info.service';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { HeaderSkeletonComponent } from '../headerSkeleton/headerSkeleton.component';
import { BehaviorSubject } from 'rxjs';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { FooterSkeletonComponent } from '../footerSkeleton/footerSkeleton.component';
import { MessageComponent } from '../message/message.component';
import { SectionComponent } from '../section/section.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HeaderSkeletonComponent, FooterSkeletonComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private userData: UserInfoService) { }

  @Input() isUserValue: boolean = false
  @Output() setIsUserValue = new EventEmitter<boolean>()

  @Input() isLoadingValue: boolean = true
  @Output() setIsLoadingValue = new EventEmitter<boolean>()

  isUser = new BehaviorSubject<boolean>(false)
  isLoading = new BehaviorSubject<boolean>(true)
  userInfo = new BehaviorSubject<IUserInfo>({ _id: "", first_name: "", last_name: "", email: "" })

  ngOnInit(): void {
    this.userData.getInfoData()
    this.userData.isUser.subscribe((value) => {
      this.setIsUserValue.emit(this.isUserValue = value)
      this.isUser.next(value)
    });
    this.userData.isLoading.subscribe((value) => {
      this.setIsLoadingValue.emit(this.isLoadingValue = value)
      this.isLoading.next(value)
    });
  }
}
