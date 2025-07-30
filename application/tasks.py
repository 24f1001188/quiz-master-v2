from celery import shared_task
from .models import User,Scores,Quiz
from flask_security import current_user
from .utils import get_user_attempts,format_report
from datetime import datetime,date
import csv
from .mail import send_email


@shared_task(ignore_results=False,name="download_report_csv")
def csv_report(user_id):
    quiz_history=get_user_attempts(user_id)
    csv_file_name=f"quiz_history_{datetime.datetime.now().strftime('%f')}.csv"
    with open(f'static/{csv_file_name}','w',newline="") as csv_file:
        s_no=1
        quiz_csv=csv.writer(csv_file,delimiter=',')
        quiz_csv.writerow(['S.No','Quiz_ID','Date_Of_Quiz','Time_Of_Attempt','No._Of_Questions','Score','Status'])
        for q in quiz_history:
            this_attempt=[s_no,q['qid'],q['date'],q['time_attempted'],q['num_questions'],q['score'],q['status']]
            quiz_csv.writerow(this_attempt)
            s_no+=1


    return csv_file_name

@shared_task(ignore_results=False,name="monthly_report")
def monthly_report():
    users=User.query.all()
    for user in users[1:]:
        user_data={}
        user_data["name"]=user.full_name
        user_data["email"]=user.email
        user_data["user_attempts"]=get_user_attempts(user.id)
        message=format_report('templates/monthly_mail.html',user_data)
        send_email(user.email,subject='Monthly Performance report - Quiz Master',message=message)

    return "Sent monthly report"

@shared_task(ignore_results=False,name="daily_reminder")
def daily_reminder():
    today=date.today()
    users=User.query.all()
    up_quizzes = Quiz.query.filter(Quiz.date_of_quiz == today).all()
    n=1
    upcoming_quizzes=[]
    if(up_quizzes):
        for quiz in up_quizzes:
            this_quiz={}
            this_quiz["no"]=n
            this_quiz["id"]=quiz.id
            this_quiz["total_marks"]=quiz.total_marks
            this_quiz["date"]=quiz.date_of_quiz.strftime("%Y-%m-%d")
            this_quiz["duration"]=quiz.time_duration.strftime("%H:%M")
            this_quiz["remarks"]=quiz.remarks
            this_quiz["chapter"]=quiz.chapter.name
        
            n+=1
            upcoming_quizzes.append(this_quiz)
        for user in users:
            message=format_report('templates/daily_reminder_mail.html',upcoming_quizzes)
            send_email(user.email,subject='Daily Quiz reminder - Quiz Master',message=message)
        return "Initiated Daily quiz reminder"
    else:
        return "No quizzes today"

        