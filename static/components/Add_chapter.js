export default{
    template:`
    <div class="d-flex justify-content-center align-items-center vh-200">
        <div class="card shadow-lg p-4 mt-5 mb-3 "  style="min-width: 300px; min-height: 450px;">
            <h3 class="text-center mb-4 text-success">Add Chapter</h3>
            <p class="text-center text-danger mt-2">{{ message }}</p>
            <div class="mb-3">
            <label for="name" class="form-label">Name :</label>
            <input type="text" id="name" class="form-control" v-model="chapter.name">
            </div>

            <div class="mb-3">
            <label for="des" class="form-label">Description :</label>
            <textarea type="text" id="des" class="form-control" v-model="chapter.description" rows="4" ></textarea>
            </div>

            <div class="text-center">
            <button class="btn btn-outline-info w-50" @click="Add_chap(sub_id)">Add</button>
            </div>
        </div>
    </div>
    `,
    data:function(){
        return{
            message:"",
            chapter:{
                name:"",
                description:""
            },
            sub_id:this.$route.params.sub_id
        }
    },
    methods:{
        Add_chap:function(s_id){
            fetch(`/api/add_chap/${s_id}`,{
            method:'POST',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.chapter)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Chapter added successfully!")
                {
                alert(data.message)
                this.$router.push('/admin_Dashboard')
                }
                else {
                    this.message=data.message
      }
                
        })
        }
    }

}