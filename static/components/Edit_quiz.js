export default{
    template: `
  <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4 mt-5 mb-3" style="min-width: 500px; min-height: 450px;">
      <h3 class="text-center mb-4 text-success">Edit Quiz</h3>
      <p class="text-center text-danger mt-2">{{ message }}</p>
      <form @submit.prevent="Edit_quiz()">
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
                <button type="submit" class="btn btn-outline-info w-50">Update</button>
              </div></form>
    </div>
  </div>
`,
mounted(){
    fetch(`/api/get_quizz/${this.quiz_id}`,{
                method:'GET',
                headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            }
        }
            ).then(response=>response.json())
            .then(data=>{
            if (data.quiz) {
                this.quiz = {
                    date_of_quiz:data.quiz.date_of_quiz,
                    time_duration:data.quiz.time_duration,
                    total_marks:data.quiz.total_marks,
                    qualifying_marks:data.quiz.qualifying_marks,
                    remarks:data.quiz.remarks
                }
            } else {
                this.message = data.message;
            }
            })
},


    data:function(){
        return{
            message:"",
            quiz:{
                date_of_quiz:"",
                time_duration:"",
                total_marks:"",
                qualifying_marks:"",
                remarks:""

            },
            quiz_id:this.$route.params.quiz_id,
            chap_id:this.$route.params.chap_id
        }
    },
    methods:{
        Edit_quiz:function(){
            fetch(`/api/update_quiz/${this.quiz_id}`,{
            method:'PUT',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.quiz)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Quiz Updated successfully!")
                {
                alert(data.message)
                this.$router.push(`/view_quiz_admin/${this.chap_id}`)
                }
                else {
                    this.message=data.message
      }
                
        })
        }
    }

}