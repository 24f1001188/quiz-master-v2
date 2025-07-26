import Welcome from "./components/Welcome.js"
import Login from "./components/Login.js"
import Register from "./components/Register.js"
import User_dashboard from "./components/User_dashboard.js"
import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js"
import ViewQuiz from "./components/ViewQuiz.js"
import Start_quiz from "./components/Start_quiz.js"
import Quiz_feedback from "./components/Quiz_feedback.js"
import Attempts from "./components/Attempts.js"
import User_Summary from "./components/User_Summary.js"

const routes=[
    {path:'/',component:Welcome},
    {path:'/Login',component:Login},
    {path:'/Register',component:Register},
    {path:'/User_Dashboard',component:User_dashboard},
    {path: '/view_quiz/:quiz_id',component: ViewQuiz},
    {path: '/start_quiz/:quiz_id',component: Start_quiz},
    {path: '/quiz_feedback/:score/:status/:total',component: Quiz_feedback},
    {path:'/scores',component:Attempts},
    {path:'/user_summary',component:User_Summary}
]

const router=new VueRouter(
    {
        routes  //routes=routes
    }
) 

const app= new Vue(
    {
        el:"#app",
        router,
        template: `
        <div class=" d-flex flex-column min-vh-100">
            <nav_bar></nav_bar>
            <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                <router-view></router-view>
            </div>
            <foot></foot>
        </div>
        `
,
        data:{
            sec:"frontend!"
        },
        components:{
            nav_bar:Navbar,
            foot:Footer
        }
    }
)