export default{
    template: `
  <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4 mt-5 mb-3" style="min-width: 500px; min-height: 450px;">
      <h3 class="text-center mb-4 text-success">Add Question</h3>
      <p class="text-center text-danger mt-2">{{ message }}</p>
      <form @submit.prevent="Add_question()">
        <div class="mb-3">
            <label for="stmt" class="form-label">Question Statement :</label>
            <textarea id="stmt" class="form-control" v-model="question.question_statement" rows="4" required></textarea>
        </div>

        <div class="mb-3">
            <label for="op1" class="form-label">Option 1 :</label>
            <input type="text" id="op1" class="form-control" v-model="question.option_1" required>
        </div>

        <div class="mb-3">
            <label for="op2" class="form-label">Option 2 :</label>
            <input type="text" id="op2" class="form-control" v-model="question.option_2" required>
        </div>

        <div class="mb-3">
            <label for="op3" class="form-label">Option 3 :</label>
            <input type="text" id="op3" class="form-control" v-model="question.option_3" required>
        </div>

        <div class="mb-3">
            <label for="op4" class="form-label">Option 4 :</label>
            <input type="text" id="op4" class="form-control" v-model="question.option_4" required>
        </div>

        <div class="mb-3">
            <label for="ans" class="form-label">Answer :</label>
            <input type="text" id="ans" class="form-control" v-model="question.answer" required>
        </div>

        <div class="mb-3">
            <label for="ans_op" class="form-label">Answer Option no :</label>
            <input type="text" id="ans_op" class="form-control" v-model="question.answer_option_no" required>
        </div>

        <div class="text-center">
            <button type="submit" class="btn btn-outline-info w-50" >Add</button>
        </div></form>
    </div>
  </div>
`,


    data:function(){
        return{
            message:"",
            question:{
                question_statement:"",
                option_1:"",
                option_2:"",
                option_3:"",
                option_4:"",
                answer_option_no:"",
                answer:""

            },
            quiz_id:this.$route.params.quiz_id,
            chap_id:this.$route.params.chap_id
        }
    },
    methods:{
        Add_question:function(){
            fetch(`/api/add_question/${this.quiz_id}`,{
            method:'POST',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.question)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Question added successfully!")
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