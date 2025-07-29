export default {
  template: `
  <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4" style="min-width: 400px; min-height: 450px;">
      <h3 class="text-center mb-4">User Login</h3>
        <div class="text-center">
        <p class = "mx-2 mt-2 text-danger">{{message}}</p>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">E-mail:</label>
        <input type="email" id="email" class="form-control" v-model="formBody.email">
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" class="form-control" v-model="formBody.password">
      </div>

      <div class="text-center">
        <button class="btn btn-outline-info w-50" @click="UserLogin">Login</button>
      </div>
    </div>
  </div>
  `,
  data:function(){
    return {
    formBody:{
        email:"",
        password:""
        },
        message:"",
        role:""
    }
    },
  methods:{
    UserLogin:function(){
        fetch('api/login',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(this.formBody)

        })
        .then(response=>response.json())
        .then(data=>{
                if(Object.keys(data).includes('token'))
                {
                localStorage.setItem("auth_token",data.token)
                localStorage.setItem("id",data.id)
                localStorage.setItem("name",data.Name)
                if(data.role=="admin"){
                  this.$router.push('/admin_dashboard')
                }
                if(data.role=="user"){
                  this.$router.push('/User_Dashboard')
                }
                }
                else{
                this.message=data.message}
                
        })
    }
  }

}
