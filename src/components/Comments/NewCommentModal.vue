<template>
  <!-- Modal -->
  <div class="modal fade" id="newCommentModal" tabindex="-1" aria-labelledby="newCommentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content text-start">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="newCommentModalLabel">Add new comment</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <p><span class="text-danger">*</span> - required field</p>
          <form @submit.prevent="submitNewCommentForm()">
            <div class="row">
              <div class="col-sm-6">
                <label for="id_username"><span class="text-danger">*</span> Username:</label>
                <input type="text" id="id_username" class="form-control" name="username" placeholder="enter username" required maxlength="150" minlength="8"
                       @input="usernameValidation($event.target)"
                       v-model="username"
                >
              </div>
              <div class="col-sm-6">
                <label for="id_email"><span class="text-danger">*</span> Email:</label>
                <input type="email" id="id_email" class="form-control" name="email" placeholder="enter email" required
                       @input="emailValidation($event.target)"
                       v-model="email"
                >
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-sm-12">
                <label for="id_home_page">Home page url:</label>
                <input type="url" id="id_home_page" class="form-control" name="home_page" placeholder="enter home page url (optional)"
                       @input="homePageValidation($event.target)"
                       v-model="home_page"
                >
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-sm-12">
                <label for="id_text"><span class="text-danger">*</span> Text <i>(max chars: 2048)</i>:</label>
                <CommentInput
                    :init="{
                      selector: '#htmlEditor'
                    }"
                    v-model="text"
                    @change="textValidation"
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-sm-12">
                <label for="">File (optional):</label>
                <p>
                  <i>Available formats:: <strong>.txt, .jpeg, .jpg, .gif, .png</strong></i>
                  <br>
                  <i>Maximum file size <strong>100 kb</strong> (kilobyte)</i>
                  <br>
                  <i>Maximum image size: <strong>320x240 px</strong></i>
                </p>
                <input type="file" id="id_file" class="form-control" name="file" @change="validateAndSetFileModel($event)">
              </div>
            </div>

            <div class="d-flex w-100 justify-content-center mt-3">
              <Recaptcha
                ref="recaptcha"
                @verify="verifyCaptcha"
              />
            </div>

            <div class="row mt-3">
              <div class="col-sm-12 w-100 text-center">
                <button class="btn btn-outline-primary">Submit</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import CommentInput from "@/components/Comments/CommentInput";
import Recaptcha from "@/components/Recaptcha";
import {upload_file_permissions} from "@/config";
import {api_endpoints} from "@/config";

export default {
  name: "NewCommentModal",
  components: {
    CommentInput, Recaptcha
  },
  props: {
    reply_to: null
  },
  data(){
    return {
      recaptcha: '',
      username: '',
      email: '',
      home_page: '',
      text: '',
      file: null,
      is_published: true,
      validations: {
        verifyCaptcha: false,
        is_valid_username: false,
        is_valid_email: false,
        is_valid_home_page: true,
        is_valid_text: false,
        is_valid_file: true
      }
    }
  },
  methods: {
    addClass(element, class_name){
      if(!element.classList.contains(class_name)){
        element.classList.add(class_name)
      }
      return element
    },
    removeClass(element, class_name){
      if(element.classList.contains(class_name)){
        element.classList.remove(class_name)
      }
      return element
    },
    processInputViewValidation(input, is_valid){
      if(is_valid){
        this.removeClass(input, 'not_valid_input') // if class exists for input
        this.addClass(input, 'valid_input')
      }
      else{
        this.removeClass(input, 'valid_input') // if class exists for input
        this.addClass(input, 'not_valid_input')
      }
      return [input, is_valid]
    },
    inputByTypeValidation(input){
      return this.processInputViewValidation(input, input.validity.valid)
    },
    usernameValidation(input){
      const regex = /^(?=[a-z0-9.]{3,20}$)[a-z0-9]+\.?[a-z0-9]+$|^.*@\w+\.[\w.]+$/i
      const is_valid = regex.test(input.value) && input.value.length >= input.minLength
      this.processInputViewValidation(input, is_valid)
      this.validations.is_valid_username = is_valid
    },
    emailValidation(input){
      this.validations.is_valid_email = this.inputByTypeValidation(input)[1]
    },
    homePageValidation(input){
      this.validations.is_valid_home_page = this.inputByTypeValidation(input)[1]
    },
    textValidation(){
      this.validations.is_valid_text = (0 < this.text.length && this.text.length <= 2048)
    },
    validateAndSetFileModel(event){
      const file = event.target.files[0]
      const is_valid_file_size = file.size <= upload_file_permissions.max_size
      const is_valid_file_type = upload_file_permissions.allowed_file_content_types.includes(file.type)
      const is_valid = is_valid_file_size && is_valid_file_type
      this.processInputViewValidation(event.target, is_valid)
      if(is_valid){
        this.file = file
      }
      else{
        this.file = File
      }
      this.validations.is_valid_file = is_valid
    },
    throwValidationError(title){
      Swal.fire({
        icon: 'error',
        title: title
      })
    },
    submitNewCommentForm(){
      const is_valid_form = (this.validations.is_valid_username && this.validations.is_valid_email
          && this.validations.is_valid_text && this.validations.is_valid_file && this.validations.verifyCaptcha)

      if(!this.validations.is_valid_username) this.throwValidationError('Username is invalid!')
      if(!this.validations.is_valid_email) this.throwValidationError('Email is invalid!')
      if(!this.validations.is_valid_text) this.throwValidationError('Text is invalid!')
      if(!this.validations.is_valid_file) this.throwValidationError('File is invalid!')
      if(!this.validations.verifyCaptcha) this.throwValidationError('Captcha is invalid!')

      if(!is_valid_form){
        return
      }

      const form = new FormData()
      if(this.reply_to && this.reply_to > 0){
        form.append('reply_to', +this.reply_to)
      }
      form.append('recaptcha', this.recaptcha)
      form.append('username', this.username)
      form.append('email', this.email)
      form.append('home_page', this.home_page)
      form.append('text', this.text)
      form.append('is_published', this.is_published)
      if(this.file){
        form.append('file', this.file)
      }
      fetch(api_endpoints.comments, {
        method: 'POST',
        body: form
      })
          .then(response => {
            if(response.status === 200){
              Swal.fire({
                icon: 'success',
                title: 'Successfully added comment'
              })
              this.cleanFormData()
              this.$emit('reload-comments')
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Failed to add comment'
              })
            }
            return response.json()
          })
          .then(json => console.log(json))
          .catch(e => {
            console.log(e)
            this.loaded = true
            Swal.fire({
              icon:'error',
              title: 'Failed to load data. Try again or later'
            })
          })
    },
    cleanFormData(){
      this.recaptcha = ''
      this.username = ''
      this.email = ''
      this.home_page = ''
      this.text = ''
      this.file = null
      this.validations = {
        verifyCaptcha: false,
        is_valid_username: false,
        is_valid_email: false,
        is_valid_home_page: true,
        is_valid_text: false,
        is_valid_file: true
      }

      const $id_username = document.querySelector('#id_username')
      const $id_email = document.querySelector('#id_email')
      const $id_home_page = document.querySelector('#id_home_page')
      const $id_file = document.querySelector('#id_file')

      this.removeClass($id_username, 'valid_input')
      this.removeClass($id_username, 'not_valid_input')

      this.removeClass($id_email, 'valid_input')
      this.removeClass($id_email, 'not_valid_input')

      this.removeClass($id_home_page, 'valid_input')
      this.removeClass($id_home_page, 'not_valid_input')

      this.removeClass($id_file, 'valid_input')
      this.removeClass($id_file, 'not_valid_input')

      this.resetCaptcha()
    },
    verifyCaptcha(response){
      this.recaptcha = response
      this.validations.verifyCaptcha = true
    },
    resetCaptcha(){
      this.recaptcha = ''
      this.$refs.recaptcha.reset()
    }
  },
}
</script>

<style scoped>
.valid_input{
  border: 1px solid green !important;
}
.not_valid_input{
  border: 1px solid red !important;
}
</style>