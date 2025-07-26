export default{
    template:`
    <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4" style="width: 500px; height: 600px;">
      <h2 class="text-center mb-4 text-primary">Quiz Details</h2>
      
      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">ID :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.id }}</div>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">Subject :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.subject }}</div>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">Chapter :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.chapter }}</div>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">Date :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.date }}</div>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">Duration (hh:mm) :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.duration }}</div>
        </div>
      </div>

      <div class="row mb-3 align-items-center">
        <div class="col-5 text-end fw-bold">Total Marks :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.total_marks }}</div>
        </div>
      </div>

      <div class="row mb-4 align-items-center">
        <div class="col-5 text-end fw-bold">Qualifying Marks :</div>
        <div class="col-7">
          <div class="border rounded p-2 bg-light">{{ quiz.qualifying_marks }}</div>
        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-outline-info w-50" @click="Close">Close</button>
      </div>
    </div>
  </div>
    `,
    data:function(){
        return{
            quiz:""
        }
    },
    mounted(){
    const id=this.$route.params.quiz_id
    fetch(`/api/view_quiz/${id}`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token")
        }
    }
    )
    .then(response=>response.json())
    .then(data=>this.quiz=data)},
    methods:{
    Close:function(){
        this.$router.push('/User_Dashboard')
    }
  }

}