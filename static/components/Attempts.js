export default {
  template: `
<div class="mx-1"><br>
    <div class="row mb-3">
      <div class="text-end">
        <button class="btn btn-secondary" @click="csvExport"><i class="bi bi-download"></i> CSV report</button>
      </div>
    </div>
    <div class="row border">
      <div class=" col border" style="width:1000px;height: 750px;">
          <h2 class="mt-4 mb-4 text-center text-primary">Past Attempts</h2>
          <div>
            <table class="table">
              <thead class="table-dark">
                <tr class="text-center">
                  <th>Quiz ID</th>
                  <th>Date</th>
                  <th>Time of Attempt</th>
                  <th>No. of Questions</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="Scores==null">
                  <td colspan="6" class="text-center text-muted">{{message}}</td>
                </tr>
                <tr v-else v-for="s in Scores" class="text-center" >
                  <td>{{ s.qid }}</td>
                  <td>{{ s.date }}</td>
                  <td>{{ s.time_attempted }}</td>
                  <td>{{ s.num_questions }}</td>
                  <td>{{ s.score }} / {{s.num_questions}}</td>
                  <td>{{s.status}}</td>
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
    Scores:null,
    message:""
    
}
},
  mounted(){
    fetch('/api/attempts',{
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
                this.Scores=data
                }
        })
  },
  methods:{
    csvExport:function(){
      fetch('/api/export_csv')
      .then(response=>response.json())
      .then(data=>{
        window.location.href=`/api/csv_result/${data.id}`
      })
    }
  }
}