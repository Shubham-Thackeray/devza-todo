import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/services/api.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
export interface todos{
low:any[],
medium:any[],
high:any[]
}
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TODOComponent implements OnInit {
  @ViewChild('customContent') private customContent;
  users = [];
  formTask: FormGroup = this.formBuilder.group({
    message: ['', [Validators.required]],
    due_date: [new Date(), [Validators.required]],
    priority: [1, [Validators.required]],
    assigned_to: ['', []],
  });
  type = 'Add';
  low = [];
  medium = [];
  todos = { low: [], medium: [], high: [] };
  control = new FormControl();
  searchArray ={ low: [], medium: [], high: [] };;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private api: ApiService,
    private toastr:ToastrService
  ) {
    console.log('here');
  }

  ngOnInit(): void {
    this.gettasks();
    this.getusers();
    // this.subscriptions.push(
      this.control.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe(val => this._filter(val));
    // );
  //  this.control.valueChanges.pipe(
  //    map(value => this._filter(value))
  //   );
    //  startWith(''),
  }

  private _filter(value: string):string {
    console.log('here');
// TODO --make simplified
    this.todos.high =  this.searchArray.high.filter(x =>{return JSON.stringify(x).toLowerCase().includes(value.toLowerCase())});
   this.todos.medium =  this.searchArray.medium.filter(x =>{return JSON.stringify(x).toLowerCase().includes(value.toLowerCase())});
   this.todos.low =  this.searchArray.low.filter(x =>{return JSON.stringify(x).toLowerCase().includes(value.toLowerCase())});
return ;
    // return this.getTodos().filter(x => (x).includes(value));
  }

  // private _normalizeValue(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }

  gettasks() {
    this.api.getTasks().subscribe((tasks) => {
      console.log(tasks);
      this.todos.low = tasks.tasks.filter((x) => x.priority == 1);
      this.todos.medium = tasks.tasks.filter((x) => x.priority == 2);
      this.todos.high = tasks.tasks.filter((x) => x.priority == 3);
      this.searchArray = JSON.parse(JSON.stringify(this.todos));
    });
  }
  getusers() {
    this.api.getUsers().subscribe((users) => {
      console.log(users, 'users');
      this.users = users.users;
    });
  }
  addTask() {
    this.resetForm();
    this.type = 'Add';
    this.formTask.removeControl('_id');
    this.modalService.open(this.customContent, {
      windowClass: 'dark-modal',
      backdrop: 'static',
      size: 'lg',
    });
  }
  submitTask() {
    if (this.type === 'Add') {
      this.api.addTask(this.getFormData()).subscribe(
        (_1) => {
          this.toastr.success('','Task added ...!');
          this.gettasks();
        },
        (err) => {
          console.log(err);
          this.toastr.error('failed');
        }
      );
    } else if (this.type === 'Edit') {
      this.api.updateTask(this.getFormData()).subscribe(
        (_1) => {
          this.gettasks();
          this.toastr.success('','Task adupdated ...!');

          // this.toast.showSuccess('Charector Updated Successfully');
        },
        (err) => {
          console.log(err);
          this.toastr.error('failed');

          // this.toast.showError(err?.error?.message);
        }
      );
    }
  }

  resetForm() {
    this.formTask.reset();
    this.formTask.controls.priority.setValue(1);
    this.formTask.controls.due_date.setValue(new Date());
  }
  getFormData() {
    // TODO due date issue

    const formData = new FormData();
    formData.append('message', this.formTask.get('message').value);
    formData.append(
      'due_date',
      this.formTask.get('due_date').value
    );
    formData.append('priority', this.formTask.get('priority').value);
    if (this.formTask.value.assigned_to) {
      formData.append('assigned_to', this.formTask.get('assigned_to').value);
    }
    if (this.formTask.value.id) {
      formData.append('taskid', this.formTask.get('id').value);
    }
    return formData;
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log('e', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // TODO --handle an api call for priority --edit not working 
      this.searchArray = JSON.parse(JSON.stringify(this.todos));

    }
  }

  edit(data) {
    this.type = 'Edit';
    console.log(data);
    this.resetForm();
    this.formTask.controls.message.setValue(data.message);
    this.formTask.controls.assigned_to.setValue(data.assigned_to);
    this.formTask.controls.due_date.setValue(data.due_date || new Date());
    // this.formTask.controls.id.setValue(data.id);
    this.formTask.get('id')
      ? this.formTask.controls.id.setValue(data.id)
      : this.formTask.addControl('id', new FormControl(data.id));
    this.formTask.controls.priority.setValue(data.priority);
    this.modalService.open(this.customContent, {
      windowClass: 'dark-modal',
      backdrop: 'static',
      size: 'lg',
    });
  }

  mapImage(data) {
    // console.log(data);
    return (
      this.users.filter((x) => x.id == data.assigned_to)[0]?.picture ||
      '../assets/devza-light.png'
    );
  }
  deleteTask() {
    const formData = new FormData();
    if (this.formTask.value.id) {
      formData.append('taskid', this.formTask.get('id').value);
    }
    this.api.daleteTask(formData).subscribe(
      (_1) => {
        this.toastr.success('','Task added ...!');
        this.gettasks();
      },
      (err) => {
        this.toastr.error('failed to delete ...');
        // this.toast.showError(err.error.message);
      }
    );
  }
  getTodos() {
    return this.todos.high.concat(this.todos.medium).concat(this.todos.low);
  }
  public displayProperty(value) {
    if (value) {
      return value.message;
    }
  }
}
