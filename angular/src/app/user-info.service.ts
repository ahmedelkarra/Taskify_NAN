import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserInfo } from '../interfaces/userInfo.interface';
import { BehaviorSubject } from 'rxjs';
import { TaskInfoService } from './task-info.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(private readonly http: HttpClient, private taskData: TaskInfoService) { }

  isUser = new BehaviorSubject<boolean>(false)
  isLoading = new BehaviorSubject<boolean>(true)
  userInfo = new BehaviorSubject<IUserInfo>({ _id: "", first_name: "", last_name: "", email: "" })


  getInfoData() {
    const token = localStorage.getItem('token') as string || ""
    this.http.get("https://taskify-nest.vercel.app/api/auth/me", { headers: { Authorization: token } })
      .subscribe({
        next: (value) => {
          const dataValue = value as IUserInfo
          this.isUser.next(true)
          this.userInfo.next(dataValue)
          this.isLoading.next(false)
        },
        complete: () => {
          this.taskData.getTaskInfo()
        },
        error: (err) => {
          // console.error(err?.error?.message);
          this.isUser.next(false)
          this.taskData.taskInfo.next([])
          this.userInfo.next({ _id: "", first_name: "", last_name: "", email: "" })
          this.isLoading.next(false)
        },
      })
  }

}
