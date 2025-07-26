export default{
    template:`
    <div class="mx-4 my-4">
  <div class="row">
    <div class="col-md-5">
      <h3 class="text-center mb-4">Quizzes Attempted per Subject</h3>
      <canvas id="barChart"></canvas>
    </div>
    <div class="col-md-2">
      
    </div>
    <div class="col-md-5">
      <h3 class="text-center mb-4">Quizzes Attempted per Month</h3>
      <canvas id="pieChart"></canvas>
    </div>
  </div>
</div>
    `,
    data:function(){return{
        subjects:[],
        sub_attempts:[],
        months:[],
        mon_attempts:[]
    }

    },
    mounted() {
        fetch('/api/user_summary',{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token")
        }
    }
    )
    .then(response=>response.json())
    .then(data=>{
                
                this.subjects=data.subjects
                this.sub_attempts=data.subject_n
                this.months=data.months
                this.mon_attempts=data.month_n
                const ctx = document.getElementById('barChart').getContext('2d')

                const subjects = this.subjects
                const attempts = this.sub_attempts

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                    labels: subjects,
                    datasets: [{
                        label: 'Quizzes Attempted',
                        data: attempts,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                    },
                    options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                            }

                    }
                    }
                })
                const pieCtx = document.getElementById('pieChart').getContext('2d')

                new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: this.months,
                    datasets: [{
                    label: 'Monthly Quiz Attempts',
                    data: this.mon_attempts,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A',
                        '#BA68C8', '#FF7043', '#26C6DA', '#AB47BC',
                        '#FFD54F', '#4DB6AC', '#7986CB', '#D4E157'
                    ],
                    borderColor: '#fff',
                    borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
                })

        })
        }
}