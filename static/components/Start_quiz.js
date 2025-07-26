export default{
    template: `
    <div class="d-flex justify-content-center align-items-center vh-200">
    <div class="card shadow-lg p-4" style="width: 700px; height: 400px;">
  <div class="container mt-4" v-if="quiz.length">
    
    <!-- Progress -->
    <div class="text-end text-muted mb-2">
      Question {{ currentIndex + 1 }} / {{ quiz.length }}
    </div>

    <!-- Current Question -->
    <h5 class="mb-3">{{ quiz[currentIndex].question_statement }}</h5>

    <!-- Options -->
    <div class="form-check mb-2" v-for="n in 4" :key="n">
      <input
        class="form-check-input"
        type="radio"
        :name="'question-' + quiz[currentIndex].id"
        :value="n"
        v-model="user_response[quiz[currentIndex].id]"
      />
      <label class="form-check-label">
        {{ quiz[currentIndex]['option_' + n] }}
      </label>
    </div>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-content-between mt-4">
      <button
        class="btn btn-secondary"
        @click="prevQuestion"
        :disabled="currentIndex === 0"
      >
        Previous
      </button>

      <div>
        <button class="btn btn-warning me-2" @click="nextQuestion"
          :disabled="currentIndex === quiz.length - 1">
          Save & Next
        </button>

        <button class="btn btn-success" @click="EndQuiz">
          Submit
        </button>
      </div>
    </div>
  </div>

  <!-- Message if no questions -->
  <div v-else class="text-danger mt-4 text-center">No questions found.</div>
  </div>
  </div>
`,
    data:function(){
        return{
            quiz_id:this.$route.params.quiz_id,
            quiz:[],
            score:0,
            total:0,
            status:"",
            user_response:{},
            currentIndex:0
        }
    },
    mounted(){
    fetch(`/api/get_question/${this.quiz_id}`,{
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
    EndQuiz:function(){
        const res_body = {
        ...this.user_response,
        time_stamp: new Date().toISOString()
      }

        fetch(`/api/get_score/${this.quiz_id}`,{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token")
        },
        body:JSON.stringify(res_body)
    }
    )
    .then(response=>response.json())
    .then(data=>{
      console.log("Server response:", data)
      this.score=data.score
      this.status=data.status
      this.total=data.total
      this.$router.push({path:`/quiz_feedback/${this.score}/${this.status}/${this.total}`})
    })
    
    
    
    },
    nextQuestion() {
    if (this.currentIndex < this.quiz.length - 1) {
      this.currentIndex++
    }
  },
  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--
    }
  }

  }

}