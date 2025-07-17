from flask import current_app as app,jsonify,request
from flask_security import auth_required, roles_required, current_user, roles_accepted,hash_password
from .dbase import db
from datetime import datetime
from .models import *

@app.route('/',methods=['GET'])
def home():
    return "<h1> Welcome to Quiz Master!</h1>"

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_dashboard():

    return jsonify({
        'message':'Login successful'
    })

@app.route('/api/user')
@auth_required('token')
@roles_accepted('admin','user')
def user_dashboard():
    user=current_user
    return jsonify({
        'username':user.email,
        'name':user.full_name
    })


@app.route('/api/view_scores/<int:quiz_id>',methods=['POST'])
@auth_required('token')
@roles_accepted('admin','user')
def view_scores(quiz_id):
    if "user" in current_user.roles:
        user_id=current_user.id
        quiz=Quiz.query.get(quiz_id)
        score=0
        status='FAIL'
        answers=request.get_json()
        #some logic to increment score if users answers match with the correct answers set by admin

        if score>=quiz.qualifying_marks:
            status='PASS'
        
        #add the details to the scores table of the database.get timestamp of event from client!

        return {
            "score":score,
            "status":status
        }
    
    if "admin" in current_user.roles:
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
        #enhance some more things after setting up UI to correspond to that!

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
                app.security.datastore.create_user(email=details['email'],password=hash_password(details['password']),
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