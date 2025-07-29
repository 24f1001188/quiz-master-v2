export default{
    template:`
    <div class="d-flex justify-content-center align-items-center vh-200">
        <div class="card shadow-lg p-4 mt-5 mb-3 "  style="min-width: 300px; min-height: 450px;">
            <h3 class="text-center mb-4 text-success">Edit Subject</h3>
            <p class="text-center text-danger mt-2">{{ message }}</p>
            <div class="mb-3">
            <label for="name" class="form-label">Name :</label>
            <input type="text" id="name" class="form-control" v-model="subject.name" >
            </div>

            <div class="mb-3">
            <label for="des" class="form-label">Description :</label>
            <textarea type="text" id="des" class="form-control" v-model="subject.description" rows="4"  ></textarea>
            </div>

            <div class="text-center">
            <button class="btn btn-outline-info w-50" @click="Edit_sub(sub_id)">Update</button>
            </div>
        </div>
    </div>
    `,
    mounted(){
        this.Fetch_subject(this.sub_id)
    }
    ,
    data:function(){
        return{
            message:"",
            subject:{
                name:"",
                description:""
            },
            sub_id:this.$route.params.sub_id,
            

        }
    },
    methods:{
        Edit_sub:function(s_id){
            fetch(`/api/update_sub/${s_id}`,{
            method:'PUT',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.subject)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Subject Updated successfully!")
                {
                alert(data.message)
                this.$router.push('/admin_Dashboard')
                }
                else {
                    this.message=data.message
                    
      }
                
        })
        },
        Fetch_subject:function(sub_id){
            fetch(`/api/get_s/${sub_id}`,{
                method:'GET',
                headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            }
        }
            ).then(response=>response.json())
            .then(data=>{
            if (data.subject) {
                this.subject = {
                name: data.subject.name,
                description: data.subject.description
                };
            } else {
                this.message = data.message;
            }
            })
        }
    }

}