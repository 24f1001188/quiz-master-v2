export default {
  template: `
<div class="mx-1"><br>
    <h2>Welcome {{UserData.name}}!!</h2>
    <div class="row border">
      <div class=" col border" style="width:1000px;height: 750px;">
          <h2 class="mt-4 mb-4 text-center text-primary">Upcoming Quizzes</h2>
          <div>
            <table class="table">
              <thead class="table-dark">
                <tr class="text-center">
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Duration(hh:mm)</th>
                  <th>Total Marks</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="Quizzes==null">
                  <td colspan="6" class="text-center text-muted">{{message}}</td>
                </tr>
                <tr v-else v-for="q in Quizzes" class="text-center" >
                  <td>{{ q.no }}</td>
                  <td>{{ q.date }}</td>
                  <td>{{ q.duration }}</td>
                  <td>{{ q.total_marks }}</td>
                  <td>{{ q.remarks || 'No remarks' }}</td>
                  <td>
                    <button class="btn  btn-outline-primary" @click="View(q.id)">View</button>
                    <button v-if="q.is_today==1"class="btn btn-success" @click="Start(q.id)">Start</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
              
      </div>  
    </div>
</div>
  `,
data:function(){
    return{
    UserData:"",
    Quizzes:null,
    message:""
    
}
},
  mounted(){
    fetch('/api/user',{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token")
        }
    }
    )
    .then(response=>response.json())
    .then(data=>this.UserData=data)

    fetch('/api/get_quiz',{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token")
        }
    }
    )
    .then(response=>response.json())
    .then(data=>{
                if(Object.keys(data).includes('message'))
                {
                this.message=data.message
                }
                else{
                this.Quizzes=data
                }
        })
  },
  methods:{
    View:function(quiz_id){
        this.$router.push(`/view_quiz/${quiz_id}`)
    },
    Start:function(quiz_id){
        this.$router.push(`/start_quiz/${quiz_id}`)
    }
  }
}