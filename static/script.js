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
import Admin_dashboard from "./components/Admin_dashboard.js"
import Edit_Chapter from "./components/Edit_chapter.js"
import Edit_Subject from "./components/Edit_Subject.js"
import Add_chapter from "./components/Add_chapter.js"
import View_quiz_admin from "./components/View_quiz_admin.js"
import Edit_question from "./components/Edit_question.js"
import Edit_quiz from "./components/Edit_quiz.js"
import Add_question from "./components/Add_question.js"


const routes=[
    {path:'/',component:Welcome},
    {path:'/Login',component:Login},
    {path:'/Register',component:Register},
    {path:'/User_Dashboard',component:User_dashboard},
    {path: '/view_quiz/:quiz_id',component: ViewQuiz},
    {path: '/start_quiz/:quiz_id',component: Start_quiz},
    {path: '/quiz_feedback/:score/:status/:total',component: Quiz_feedback},
    {path:'/scores',component:Attempts},
    {path:'/user_summary',component:User_Summary},
    {path:'/admin_Dashboard',component:Admin_dashboard},
    {path:'/edit_chapter/:chap_id',component:Edit_Chapter},
    {path:'/edit_subject/:sub_id',component:Edit_Subject},
    {path:'/add_chapter/:sub_id',component:Add_chapter},
    {path:'/view_quiz_admin/:chap_id',component:View_quiz_admin},
    {path:'/edit_quiz/:chap_id/:quiz_id',component:Edit_quiz},
    {path:'/edit_question/:chap_id/:ques_id',component:Edit_question},
    {path:'/add_question/:chap_id/:quiz_id',component:Add_question}
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
            <div class="flex-grow-1 d-flex  align-items-center justify-content-center">
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