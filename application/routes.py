from flask import current_app as app,jsonify,request,render_template,send_from_directory
from flask_security import auth_required, roles_required, current_user, roles_accepted,login_user
from .dbase import db
from datetime import datetime,date
from .models import *
from werkzeug.security import check_password_hash,generate_password_hash
from celery.result import AsyncResult
from .tasks import csv_report
from .utils import get_user_attempts


@app.route('/',methods=['GET'])
def home():
    return render_template("index.html")

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_dashboard():

    return jsonify({
        'message':'Login successful'
    }),200

@app.route('/api/user')
@auth_required('token')
@roles_accepted('admin','user')
def user_dashboard():
    user=current_user
    if(user):
        return jsonify({
            'username':user.email,
            'name':user.full_name,
            'id':user.id,
            'message':"Login Succesful"
        }),200
    else:
        return jsonify({
            "message":"You need to sign to view this endpoint"
        }),403

@app.route('/api/view_quiz/<int:quiz_id>')
@auth_required('token')
@roles_accepted('admin','user')
def view_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    chapter=quiz.chapter
    subject=chapter.subject   

    this_quiz={}
    this_quiz["id"]=quiz.id
    this_quiz["subject"]=subject.name
    this_quiz["chapter"]=chapter.name
    this_quiz["total_marks"]=quiz.total_marks
    this_quiz["qualifying_marks"]=quiz.qualifying_marks
    this_quiz["date"]=quiz.date_of_quiz.strftime("%Y-%m-%d")
    this_quiz["duration"]=quiz.time_duration.strftime("%H:%M")
    
    return jsonify(this_quiz),200

@app.route('/api/user_summary')
@auth_required('token')
@roles_accepted('user')
def user_summary():
    user=current_user
    scores=Scores.query.filter_by(user_id=user.id).order_by(Scores.time_stamp_of_event)
    month_n={}
    months=[]
    monthwise_n=[]
    subject_n={}
    subjects=[]
    subjectwise_n=[]
    n=0
    for score in scores:
        month=score.quiz.date_of_quiz.month
        if month in month_n:
            month_n[month]+=1
        else:
            month_n[month]=1

        subject=score.quiz.chapter.subject.name
        if subject in subject_n:
            subject_n[subject]+=1
        else:
            subject_n[subject]=1

    for month in sorted(month_n):
        months.append(month)
        monthwise_n.append(month_n[month])
    for sub in subject_n:
        subjects.append(sub)
        subjectwise_n.append(subject_n[sub])

    return jsonify({
        "months":months,
        "month_n":monthwise_n,
        "subjects":subjects,
        "subject_n":subjectwise_n
    }),200




    
    
@app.route('/api/attempts',methods=['GET'])
@auth_required('token')
@roles_accepted('user')
def attempts():
    user=current_user
    scores_json=get_user_attempts(user.id)
    if (scores_json):
        return jsonify(scores_json),200
    else:
        return jsonify({
            "message":"No Attempts of Quiz found!"
        }),200


@app.route('/api/get_duration/<int:quiz_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('user')
def get_duration(quiz_id):
    quiz=Quiz.query.get(quiz_id)
    duration=quiz.time_duration
    h=duration.hour
    m=duration.minute
    s=duration.second

    secs=(h*60*60)+(m*60)+s
    return jsonify({"secs":secs}),200




@app.route('/api/get_score/<int:quiz_id>',methods=['POST'])
@auth_required('token')
@roles_accepted('user')
def get_score(quiz_id):
    if "user" in current_user.roles:
        user_id=current_user.id
        quiz=Quiz.query.get(quiz_id)
        score=0
        status='FAIL'
        body=request.get_json()
        print(body)
        for question in quiz.questions:
            qid=str(question.id)
            ans=question.answer_option_no
            print(f"Checking Q{qid}: correct={ans}, user_answer={body.get(qid)}")
            if qid in body:
                if body[qid]==ans:
                    score+=1
        if score>=quiz.qualifying_marks:
            status='PASS'
        time_str=body['time_stamp']
        time_stamp=datetime.fromisoformat(time_str.replace('Z', ''))

        is_passed=False
        if(status=='PASS'):
            is_passed=True
        score_db=Scores(quiz_id=quiz_id,user_id=user_id,time_stamp_of_event=time_stamp,
                     is_passed=is_passed,total_scored=score)
        db.session.add(score_db)
        db.session.commit()
        return jsonify({
            "score":score,
            "status":status,
            "total":quiz.total_marks
        }),200
    
    '''if "admin" in current_user.roles:
        quiz=Quiz.query.get(quiz_id)
        scores=Scores.query.filter_by(quiz_id=quiz_id).all()
        average=0
        sum=0
        n=0
        for score in scores:
            sum+=score.total_scored
            n+=1
        average=(sum/n)

        return {
            "Quiz_id":quiz_id,
            "Scores":scores,
            "Average":average
        }
        #enhance some more things after setting up UI to correspond to that!'''
    #above is for quiz wise summary of users to be seen by the admin

@app.route('/api/login',methods=['POST'])
def login():
    body=request.get_json()
    email=body['email']
    password=body['password']

    if not email:
        return jsonify({
            "message":"E-mail is not provided!"
        }),400
    
    if not password:
        return jsonify({
            "message":"Password is not provided!"
        }),400
    
    user=app.security.datastore.find_user(email=email)

    if user:
        if check_password_hash(user.password,password):
            login_user(user)
            if "admin" in user.roles:
                user_role="admin"
            else:
                user_role="user"
            return jsonify({
                "id":user.id,
                "Name":user.full_name,
                "token":user.get_auth_token(),
                "role":user_role,
                "message":"Login successful"
            })
        else:
            return jsonify({
                "message":"Password is incorrect!"
            }),400
    
    else:
        return jsonify({
        "message":"User does not exist!"
    }),404









@app.route('/api/register',methods=['POST'])
def register_user():
    details=request.get_json()

    try:
        if "dob" in details.keys() and details["dob"] is not None:
            parsed_dob = datetime.strptime(details['dob'], '%Y-%m-%d').date()
        else:
            return jsonify(
                {
                    "message":"DOB is mandatory!"
                }
            ),400


    except ValueError:
        return jsonify({
            "message": "Date of birth must be in 'YYYY-MM-DD' format"
        }), 400
    
    if "email" in details.keys() and details["email"] is not None:
        if not app.security.datastore.find_user(email=details['email']):
            try:
                app.security.datastore.create_user(email=details['email'],password=generate_password_hash(details['password']),
                                                full_name=details['full_name'],qualification=details.get('qualification'),
                                                dob=parsed_dob,
                                                roles=['user'])
                
                db.session.commit()

                return jsonify({
                    "message":"User registered succesfully"
                    }),201
            except:
                return jsonify(
                    {
                        "message":"Password and Full name are mandatory!"
                    }
                ),400
    

        return jsonify({
            "message":"User with this email already exists!"
            }),400
    
    else:
        return jsonify(
                    {
                        "message":"E-mail is mandatory!"
                    }
                ),400
    
@app.route('/api/get_ch/<int:ch_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def get_ch(ch_id):
    chap=Chapter.query.get(ch_id)
    if(chap):
        return jsonify({
            "chapter":{
            "name":chap.name,
            "description":chap.description
        }}),200
    
    return jsonify({
            "message":"Chapter not found!"
    }),404

@app.route('/api/get_s/<int:s_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def get_s(s_id):
    sub=Subject.query.get(s_id)
    if(sub):
        return jsonify({
        "subject":{
            "name":sub.name,
            "description":sub.description
        }}),200
    
    return jsonify({
            "message":"Subject not found!"
    }),404

@app.route('/api/get_ques/<int:ques_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def get_ques(ques_id):
    ques=Questions.query.get(ques_id)
    if(ques):
        return jsonify({
        "question":{
            "question_statement":ques.question_statement,
            "option_1":ques.option_1,
            "option_2":ques.option_2,
            "option_3":ques.option_3,
            "option_4":ques.option_4,
            "answer_option_no":ques.answer_option_no,
            "answer":ques.answer
        }}),200
    
    return jsonify({
            "message":"Question not found!"
    }),404

@app.route('/api/get_quizz/<int:quiz_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def get_quizz(quiz_id):
    quiz=Quiz.query.get(quiz_id)
    if(quiz):
        return jsonify({
        "quiz":{
            "date_of_quiz":quiz.date_of_quiz.strftime("%Y-%m-%d"),
            "time_duration":quiz.time_duration.strftime("%H:%M"),
            "total_marks":quiz.total_marks,
            "qualifying_marks":quiz.qualifying_marks,
            "remarks":quiz.remarks            
        }}),200
    
    return jsonify({
            "message":"Quiz not found!"
    }),404






def get_questions(quiz_id):
    questions = Questions.query.filter_by(quiz_id=quiz_id).all()
    question_list = []
    for i, q in enumerate(questions, start=1):
        question_list.append({
            "no": i,
            "id": q.id,
            "q_stmt": q.question_statement,
            "ans": q.answer,
            "ans_op_no":q.answer_option_no
        })
    return question_list

@app.route('/api/get_quiz/<int:chap_id>',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def get_quiz_admin(chap_id):
        
        quizzes = Quiz.query.filter_by(chapter_id=chap_id).all()
        n=1
        result=[]
        if(quizzes):
            for quiz in quizzes:
                this_quiz={}
                this_quiz["no"]=n
                this_quiz["id"]=quiz.id
                this_quiz["total_marks"]=quiz.total_marks
                this_quiz["date"]=quiz.date_of_quiz.strftime("%Y-%m-%d")
                this_quiz["duration"]=quiz.time_duration.strftime("%H:%M")
                this_quiz["remarks"]=quiz.remarks
                this_quiz["questions"]=get_questions(quiz.id)

                
                
                n+=1
                result.append(this_quiz)
            
            return jsonify(result),200
        else:
            return jsonify({
                "message":"No Quizzes found"
            }),404


@app.route('/api/export_csv')
def export_csv():
    result=csv_report.delay(current_user.id)
    return jsonify({
        "id":result.id,
        "result":result.result
        })

@app.route('/api/csv_result/<id>')
def csv_result(id):
    res=AsyncResult(id)
    return send_from_directory('static',res.result)

    