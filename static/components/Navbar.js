export default {
    template: `
    <div class="row border  py-2" style="background-color:rgb(0, 157, 181);">
        <div class="col-10 d-flex align-items-center">
            <h2 class="my-2" style="color: white;">&nbsp; QUIZ MASTER</h2>
            <div>
                <router-link class="text-decoration-none fs-6 text-light ms-5 me-2" to="/User_dashboard"> | Dashboard | </router-link>
                <router-link class="text-decoration-none fs-6 text-light me-2" to="/scores">Attempts | </router-link>
                <router-link class="text-decoration-none fs-6 text-light me-2" to="/user_summary">Summary |</router-link>
            </div>
        </div>
        <div class="col-2 ">
            <router-link class="btn btn-light me-2" to="/Register">Register</router-link>
            <router-link class="btn btn-warning my-2" to="/Login">Login</router-link>
        </div>
    </div>
    `
}
