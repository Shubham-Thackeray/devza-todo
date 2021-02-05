import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private api: ApiBaseService) {}
  getUsers(){
    return this.api.get('tasks/listusers', {}, {});
  }
  getTasks(){
    return this.api.get('tasks/list', {}, {});
  }

  updateTask(data) {
    return this.api.put('tasks/update', data, {});
  }

  daleteTask(data) {
    return this.api.delete('tasks/delete', { body: data });
  }

  addTask(data:FormData) {
    return this.api.post('tasks/create', data, {});
  }

}
