from .models import Scores

def get_user_attempts(user_id):
    scores=Scores.query.filter_by(user_id=user_id).order_by(Scores.time_stamp_of_event.desc())
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