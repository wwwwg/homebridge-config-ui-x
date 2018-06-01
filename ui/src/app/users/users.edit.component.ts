import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { TranslateService } from '@ngx-translate/core';
import { StateService } from '@uirouter/angular';
import { ToastrService } from 'ngx-toastr';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users.add-edit.component.html'
})
export class UsersEditComponent implements OnInit {
  @Input() user;
  form: FormGroup;
  page = {
    title: 'users.title_edit_user',
    save: 'form.button_save',
    password: 'users.label_new_password'
  };

  constructor(
    public activeModal: NgbActiveModal,
    public toastr: ToastrService,
    private translate: TranslateService,
    private $api: ApiService,
    private $state: StateService,
    public $fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.$fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.minLength(4)],
      passwordConfirm: [''],
      admin: [true]
    }, {
      validator: this.matchPassword
    });

    this.form.patchValue(this.user);
  }

  matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const passwordConfirm = AC.get('passwordConfirm').value;
    if (password !== passwordConfirm) {
      AC.get('passwordConfirm').setErrors({ matchPassword: true });
    } else {
      return null;
    }
  }

  onSubmit({ value, valid }) {
    this.$api.updateUser(this.user.id, value).subscribe(
      async data => {
        const toastSuccess = await this.translate.get('toast.title_success').toPromise();
        const toastUpdatedUser = await this.translate.get('users.toast_updated_user').toPromise();
        this.$state.reload();
        this.activeModal.close();
        this.toastr.success(toastUpdatedUser, toastSuccess);
      },
      async err => {
        const toastError = await this.translate.get('toast.title_error').toPromise();
        const toastFailedToUpdatedUser = await this.translate.get('users.toast_failed_to_add_user').toPromise();
        this.toastr.error(toastFailedToUpdatedUser, toastError);
      }
    );
  }

}
