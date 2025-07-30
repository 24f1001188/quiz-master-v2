from celery import shared_task
from .models import User,Scores
from flask_security import current_user
from .utils import get_user_attempts
import datetime
import csv


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
    return "Sent monthly report"

@shared_task(ignore_results=False,name="daily_quiz_reminder")
def daily_reminder():
    return "Initiated Daily quiz reminder"