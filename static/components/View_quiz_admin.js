export default {
    template: `
  <div> 
    <div class="mx-2">
      <br>
      <div class="row ">
        <div class=" col-md-8 " >
          <br>
          <h3 class="text-center text-primary">{{message1}}</h3>
          <div v-if="quizzes==null">
            <h3 class="text-center text-primary">{{q_message}}</h3>
          </div>

          <div v-else v-for="q in quizzes" class="card mb-5 ms-0 " style="width: 600px;" >

            <div class="card-body">

            <div class="text-center row">
                <h2 class="card-title text-success"><strong>Quiz {{q.no}}</strong></h2>
                <div class="text-center ">
                    <button class="btn  btn-outline-primary" @click="Edit_quiz(q.id)">Edit</button>
                    <button class="btn btn-danger" @click="Delete_quiz(q.id)">Delete</button>
                </div>
            </div><br>

            <table class="table">
                <thead class="table-info">
                  <tr class="text-center ">
                    <th class="col border">S.No</th>
                    <th class="col border">ID</th>
                    <th class="col border">Question Statement </th>
                    <th class="col border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!q.questions || q.questions.length === 0">
                    <td colspan="6" class="text-center text-muted">No questions found!</td>
                  </tr>
                  <tr v-else v-for="qu in q.questions"  >
                    <td class="col border">{{ qu.no}}</td>
                    <td >{{ qu.id }}</td>
                    <td> {{ qu.q_stmt}}</td>
                    
                    <td class="col border">
                      <button class="btn  btn-outline-primary" @click="Edit_ques(qu.id)"><i class="bi bi-pencil-square"></i></button>
                      <button class="btn btn-danger" @click="Delete_ques(qu.id)"><i class="bi bi-trash"></i></button>
                      </td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-success" @click="Add_ques(q.id)">+Question</button>
            </div>
          </div>

        </div>

        <div class=" col-md-4" style="width:300px;"  >
          <div>
            <div class="card shadow-lg p-4 mt-5 mb-3 ">
              <h3 class="text-center mb-4 text-success">Add Quiz</h3>
              <p class="text-center text-danger mt-2">{{ message }}</p>
              <form @submit.prevent="Add_quiz(chap_id)">
              <div class="mb-3">
                <label for="date" class="form-label">Date of Quiz :</label>
                <input type="date" id="date" class="form-control" v-model="quiz.date_of_quiz" required>
              </div>

              <div class="mb-3">
                <label for="dur" class="form-label">Duration :</label>
                <input type="text" id="dur" class="form-control" v-model="quiz.time_duration" placeholder="hh:mm" required>
              </div>
              <div class="mb-3">
                <label for="tot_marks" class="form-label">Total Marks :</label>
                <input type="number" min="0" step="1" id="tot_marks" class="form-control" v-model="quiz.total_marks" required>
              </div>

              <div class="mb-3">
                <label for="qual_marks" class="form-label">Qualifying Marks :</label>
                <input type="number" min="0" step="1" id="qual_marks" class="form-control" v-model="quiz.qualifying_marks" required>
              </div>

              <div class="mb-3">
                <label for="rem" class="form-label">Remarks :</label>
                <textarea type="text" id="rem" class="form-control" v-model="quiz.remarks" rows="3" ></textarea>
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-outline-info w-50">Add</button>
              </div></form>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div> 
`
,
    data:function(){
        return{
            message:"",
            quizzes:null,
            q_message:"",
            quiz:{
                date_of_quiz:null,
                time_duration:null,
                total_marks:null,
                qualifying_marks:null,
                remarks:null
            },
            message1:"",
            chap_id:this.$route.params.chap_id
        }
    },
    mounted(){
        this.refreshQuizzes(this.chap_id)
    },
    methods:{

    Add_quiz:function(chap_id){
    

        fetch(`/api/add_quiz/${chap_id}`,{
            method:'POST',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.quiz)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Quiz added successfully!")
                {
                this.message1=data.message
                this.refreshQuizzes(this.chap_id)
                this.message=""
                this.quiz.date = null
                this.quiz.duration = null
                this.quiz.total_marks=null
                this.quiz.qualifying_marks=null
                this.quiz.remarks=null
                }
                else {
                    this.message = data.message 
      }
                
        })
    },
    Add_ques:function(quiz_id){
        this.$router.push(`/add_question/${this.chap_id}/${quiz_id}`)
    },

    Edit_ques:function(ques_id){
        this.$router.push(`/edit_question/${this.chap_id}/${ques_id}`)
        
    },
    Edit_quiz:function(quiz_id){
        this.$router.push(`/edit_quiz/${this.chap_id}/${quiz_id}`)
        
    },

    Delete_quiz:function(quiz_id){
        fetch(`/api/delete_quiz/${quiz_id}`,{
            method:'DELETE',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
        }).then(response=>response.json())
        .then(data=>{
                if(Object.keys(data).includes('message'))
                {
                this.message1=data.message
                this.refreshQuizzes(this.chap_id)
                }
                
        })

    },
    Delete_ques:function(ques_id){
        fetch(`/api/delete_question/${ques_id}`,{
            method:'DELETE',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
        }).then(response=>response.json())
        .then(data=>{
                if(Object.keys(data).includes('message'))
                {
                this.message1=data.message
                this.refreshQuizzes(this.chap_id)
                }
                
        })

    },
    refreshQuizzes: function(chap_id) {
  fetch(`/api/get_quiz/${chap_id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Token-for-Authentication": localStorage.getItem("auth_token"),
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      this.q_message = data.message
      this.quizzes = null
    } else {
      this.quizzes = data
      console.log(this.quizzes)
      this.q_message = ""
    }
  })
}



  }
}