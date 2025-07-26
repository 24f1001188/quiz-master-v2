export default{
    template: `
    <div class="d-flex justify-content-center align-items-center vh-200">
        <div class="card shadow-lg p-4" style="width: 400px; height: 300px;">
            <div class="d-flex justify-content-center align-items-center mt-3 mb-3">
                <h4 class="me-3 mt-2">Score :</h4>
                <div class="border rounded p-2 bg-light">{{ score }} / {{total}}</div>
            </div>

            <br>
            <div>
                <h4 v-if="status=='PASS'" class=" mt-4 text-success text-center">You have passed the test!</h4>
                <h4 v-else class="text-danger mt-4 text-center">You have failed the test.<br> Please try again!</h4>
            </div><br>
            <div class="text-center mt-5">
                <button class="btn btn-outline-info w-50" @click="Close">Close</button>
            </div>
        </div>
    </div>
`,mounted() {
  console.log("Received params:", this.$route.params);
}
,
    data:function(){
        return{
            score:this.$route.params.score,
            status:this.$route.params.status,
            total:this.$route.params.total

        }
    },
    methods:{
    Close:function(){
        this.$router.push('/User_Dashboard')
    }
  }


}