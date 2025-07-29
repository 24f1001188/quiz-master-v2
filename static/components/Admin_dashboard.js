export default {
    template: `
  <div> 
    <div class="mx-2">
      <br>
      <h2>Welcome ADMIN!!</h2>
      <div class="row">
        <div class=" col-9 " >
          <br>
          <h3 class="text-center text-primary">{{message1}}</h3>
          <div v-if="subjects==null">
            <h3 class="text-center text-primary">{{s_message}}</h3>
          </div>

          <div v-else v-for="s in subjects" class="card mb-5 ms-0" style="width: 100%;" >

            <div class="card-body">

            <div class="text-center row">
                <h2 class="card-title text-success"><strong>{{s.name}}</strong></h2>
                <div class="col-9 " >
                    <h5><strong>ID : </strong>{{s.id}} </h5>
                    <h5><strong>Description :</strong> <em>{{s.description}} </em></h5>
                </div>
                <div class="col-3 ">
                    <button class="btn  btn-outline-primary" @click="Edit_sub(s.id)">Edit</button>
                    <button class="btn btn-danger" @click="Delete_sub(s.id)">Delete</button>
                </div>
            </div><br>

            <table class="table">
                <thead class="table-info">
                  <tr class="text-center ">
                    <th class="col border">S.No</th>
                    <th class="col border">Chapter ID</th>
                    <th class="col border">Name</th>
                    <th class="col border">Description</th>
                    <th class="col border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!s.chapters || s.chapters.length === 0">
                    <td colspan="6" class="text-center text-muted">No Chapters found!</td>
                  </tr>
                  <tr v-else v-for="c in s.chapters"  >
                    <td class="col border">{{ c.no}}</td>
                    <td >{{ c.id }}</td>
                    <td> {{ c.name }}</td>
                    <td >{{ c.description }}</td>
                    <td class="col border">
                      <button class="btn  btn-outline-primary" @click="Edit_chap(c.id)"><i class="bi bi-pencil-square"></i></button>
                      <button class="btn btn-danger" @click="Delete_chap(c.id)"><i class="bi bi-trash"></i></button>
                      <button class="btn btn-outline-warning" @click="View_quiz(c.id)"><i class="bi bi-eye"></i></button>
                      </td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-success" @click="Add_chap(s.id)">+Chapter</button>
            </div>
          </div>

        </div>

        <div class=" col-3 "  >
          <div>
            <div class="card shadow-lg p-4 mt-5 mb-3 ">
              <h3 class="text-center mb-4 text-success">Add Subject</h3>
              <p class="text-center text-danger mt-2">{{ message }}</p>
              <div class="mb-3">
                <label for="sub" class="form-label">Name :</label>
                <input type="text" id="sub" class="form-control" v-model="subject.name">
              </div>

              <div class="mb-3">
                <label for="des" class="form-label">Description :</label>
                <textarea type="text" id="des" class="form-control" v-model="subject.description" rows="4" ></textarea>
              </div>

              <div class="text-center">
                <button class="btn btn-outline-info w-50" @click="Add_sub">Add</button>
              </div>
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
            subjects:null,
            s_message:"",
            subject:{
                name:"",
                description:""
            },
            message1:""
        }
    },
    mounted(){
        this.refreshSubjects()
    },
    methods:{

    Add_sub:function(){
        fetch('/api/add_sub',{
            method:'POST',
            headers:{
            "Content-Type":"application/json",
            "Token-for-Authentication":localStorage.getItem("auth_token"),
            },
            body:JSON.stringify(this.subject)
        }).then(response=>response.json())
        .then(data=>{
            if(data.message=="Subject added successfully!")
                {
                this.message1=data.message
                this.refreshSubjects()
                this.subject.name = ""
                this.subject.description = ""
                }
                else {
                    this.message = data.message 
      }
                
        })
    },
    Add_chap:function(sub_id){
        this.$router.push(`/add_chapter/${sub_id}`)
    },

    Edit_chap:function(chap_id){
        this.$router.push(`/edit_chapter/${chap_id}`)
        
    },
    Edit_sub:function(sub_id,sub_name,sub_des){
        this.$router.push(`/edit_subject/${sub_id}`)
        
    },

    Delete_sub:function(sub_id){
        fetch(`/api/delete_sub/${sub_id}`,{
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
                this.refreshSubjects()
                }
                
        })

    },
    Delete_chap:function(chap_id){
        fetch(`/api/delete_chap/${chap_id}`,{
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
                this.refreshSubjects()
                }
                
        })

    },
    refreshSubjects: function() {
  fetch('/api/get_sub', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Token-for-Authentication": localStorage.getItem("auth_token"),
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      this.s_message = data.message
      this.subjects = null
    } else {
      this.subjects = data
      this.s_message = ""
    }
  })
},
View_quiz:function(chap_id){
    this.$router.push(`/view_quiz_admin/${chap_id}`)
}



  }
}