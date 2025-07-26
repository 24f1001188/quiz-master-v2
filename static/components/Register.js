export default {
  template: `
  <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4" style="min-width: 400px; min-height: 450px;">
      <h3 class="text-center mb-4">User Login</h3>
        <div class="text-center">
        <p>{{message}}</p>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">E-mail:</label>
        <input type="text" id="email" class="form-control" v-model="formBody.email">
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-control" v-model="formBody.password">
      </div>

      <div class="mb-3">
        <label for="fullname" class="form-label">Full Name:</label>
        <input type="text" id="full_name" class="form-control" v-model="formBody.full_name">
      </div>

      <div class="mb-3">
        <label for="qualification" class="form-label">Qualification:</label>
        <input type="text" id="qualification" class="form-control" v-model="formBody.qualification">
      </div>

      <div class="mb-3">
        <label for="dob" class="form-label">DOB:</label>
        <input type="date" id="dob" class="form-control" v-model="formBody.dob">
      </div>

      <div class="text-center">
        <button class="btn btn-outline-info w-50" @click="UserRegister">Register</button>
      </div>
    </div>
  </div>
  `,
  data:function(){
    return {
    formBody:{
        email:"",
        password:"",
        full_name:"",
        qualification:"",
        dob:""
        },
        message:""
    }
    },
  methods:{
    UserRegister:function(){
        fetch('api/register',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(this.formBody)

        })
        .then(response=>response.json())
        .then(data=>{
                this.message=data.message
                this.$router.push('/Login')

        })
    }
  }

}
