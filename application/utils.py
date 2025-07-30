from .models import Scores
from jinja2 import Template
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
from .models import Scores

def get_user_attempts(user_id,is_monthly=0):
    scores=Scores.query.filter_by(user_id=user_id).order_by(Scores.time_stamp_of_event.desc())
    if is_monthly:
        today = date.today()
        # 1st day of current month
        first_day_of_current_month = today.replace(day=1)
        # Last day of previous month = day before the 1st of current month
        last_day_previous_month = first_day_of_current_month - timedelta(days=1)
        # First day of previous month
        first_day_previous_month = last_day_previous_month.replace(day=1)

        query = query.filter(
            Scores.time_stamp_of_event >= datetime.combine(first_day_previous_month, datetime.min.time()),
            Scores.time_stamp_of_event <= datetime.combine(last_day_previous_month, datetime.max.time())
        )

        scores = query.order_by(Scores.time_stamp_of_event.desc())

    attempts=[]
    
    for score in scores:
        this_score={}
        this_score["id"]=score.id
        this_score["date"]=score.time_stamp_of_event.date().strftime('%Y-%m-%d')
        this_score["time_attempted"]=score.time_stamp_of_event.time().strftime('%H:%M:%S')
        this_score["num_questions"]=score.quiz.total_marks
        this_score["score"]=score.total_scored
        this_score["qid"]=score.quiz.id
        if(score.is_passed):
            this_score["status"]="PASS"
        else:
            this_score["status"]="FAIL"
        attempts.append(this_score)   
    return attempts

def format_report(html_template,data):
    with open(html_template) as file:
        template=Template(file.read())
        return template.render(data=data)