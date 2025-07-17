from flask_restful import Api,Resource,reqparse
from .models import *
from flask_security import auth_required, roles_required, current_user, roles_accepted
from datetime import datetime

api=Api()

def parse_date(value):
    return datetime.strptime(value, '%Y-%m-%d').date()

def parse_time(value):
   return datetime.strptime(value, "%H:%M:%S").time()

sub_parser=reqparse.RequestParser()
sub_parser.add_argument('name',required=True,help="Name of the subject is mandatory!")
sub_parser.add_argument('description',required=True,help="Description of the subject is mandatory!")

chap_parser=reqparse.RequestParser()
chap_parser.add_argument('name',required=True,help="Name of the chapter is mandatory!")
chap_parser.add_argument('description',required=True,help="Description of the chapter is mandatory!")

quiz_parser=reqparse.RequestParser()
quiz_parser.add_argument('date_of_quiz',required=True,type=parse_date,help="Date is mandatory and must be valid and in YYYY-MM-DD format!")
quiz_parser.add_argument('time_duration',required=True,type=parse_time,help="Time duration is mandatory and must be valid and in HH:MM:SS format (24-hour clock)!")
quiz_parser.add_argument('total_marks',required=True,type=int,help="Total marks is mandatory!")
quiz_parser.add_argument('qualifying_marks',required=True,type=int,help="Qualifying marks is mandatory!")
quiz_parser.add_argument('remarks')

ques_parser=reqparse.RequestParser()
ques_parser.add_argument('question_statement',required=True,help="Question statement is mandatory!")
ques_parser.add_argument('option_1',required=True,help="Option 1 is mandatory!")
ques_parser.add_argument('option_2',required=True,help="Option 2 is mandatory!")
ques_parser.add_argument('option_3',required=True,help="Option 3 is mandatory!")
ques_parser.add_argument('option_4',required=True,help="Option 4 is mandatory!")
ques_parser.add_argument('answer_option_no',type=int,required=True,help="Answer option number is mandatory and must be an integer!")
ques_parser.add_argument('answer',required=True,help="Answer is mandatory!")



class SubjectApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self):
        subjects=Subject.query.all()
        subjects_json=[]

        for subject in subjects:
            this_sub={}

            this_sub["id"]=subject.id
            this_sub["name"]=subject.name
            this_sub["description"]=subject.description

            subjects_json.append(this_sub)
        
        if subjects_json:
            return subjects_json
        
        return {
            "message":"No subjects available!"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        sub_args=sub_parser.parse_args()

        subject=Subject(name=sub_args["name"],
                        description=sub_args["description"])
        
        db.session.add(subject)
        db.session.commit()

        return {
            "message":"Subject added successfully!"
        }

        
        
    @auth_required('token')
    @roles_required('admin')
    def put(self,sub_id):
        sub_args=sub_parser.parse_args()
        subject=Subject.query.get(sub_id)

        if not subject:
            return {"message": "Subject not found!"}, 404


        
        subject.name=sub_args["name"]
        subject.description=sub_args["description"]
        
        db.session.commit()

        return {
            "message":"Subject Updated successfully"
        }

        
        
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self,sub_id):
        subject=Subject.query.get(sub_id)
        if subject:
            db.session.delete(subject)
            db.session.commit()
            return {
                "message":"Subject deleted successfully!"
            }

        return {
            "message":"Subject not found!"
        },404
        





class ChapterApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self,sub_id):
        chapters=Chapter.query.filter_by(subject_id=sub_id).all()
        chapters_json=[]

        for chapter in chapters:
            this_chap={}

            this_chap["id"]=chapter.id
            this_chap["name"]=chapter.name
            this_chap["description"]=chapter.description

            chapters_json.append(this_chap)
        
        if chapters_json:
            return chapters_json
        
        return {
            "message":"No chapters are added to this subject!"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self,sub_id):
        chap_args=chap_parser.parse_args()

        
        chapter=Chapter(name=chap_args["name"],
                        description=chap_args["description"],
                        subject_id=sub_id)
        
        db.session.add(chapter)
        db.session.commit()

        return {
            "message":"Chapter added successfully!"
        }

        
        
    @auth_required('token')
    @roles_required('admin')
    def put(self,chap_id):
        chap_args=chap_parser.parse_args()
        chapter=Chapter.query.get(chap_id)
        
        if not chapter:
            return {"message": "Chapter not found!"}, 404

        chapter.name=chap_args["name"]
        chapter.description=chap_args["description"]
    
        db.session.commit()

        return {
            "message":"Chapter Updated successfully!"
        }

        
        
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self,chap_id):
        chapter=Chapter.query.get(chap_id)
        if chapter:
            db.session.delete(chapter)
            db.session.commit()
            return {
                "message":"Chapter deleted successfully!"
            }

        return {
            "message":"Chapter not found!"
        },404
    
class QuizApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self,chap_id):
        quizzes=Quiz.query.filter_by(chapter_id=chap_id).all()
        quizzes_json=[]

        for quiz in quizzes:
            this_quiz={}

            this_quiz["id"]=quiz.id
            this_quiz["date_of_quiz"]=quiz.date_of_quiz.strftime('%Y-%m-%d')
            this_quiz["time_duration"]=quiz.time_duration.strftime('%H:%M:%S')
            this_quiz["total_marks"]=quiz.total_marks
            this_quiz["qualifying_marks"]=quiz.qualifying_marks
            this_quiz["remarks"]=quiz.remarks

            quizzes_json.append(this_quiz)
        
        if quizzes_json:
            return quizzes_json
        
        return {
            "message":"No quizzes are added to this chapter!"
        },404
        
    @auth_required('token')
    @roles_required('admin')
    def post(self,chap_id):
        quiz_args=quiz_parser.parse_args()

        if quiz_args["total_marks"] < 0 or quiz_args["qualifying_marks"] < 0:
            return {"message": "Marks cannot be negative"}, 400

        if quiz_args["qualifying_marks"] > quiz_args["total_marks"]:
            return {"message": "Qualifying marks cannot exceed total marks"}, 400

        
        quiz=Quiz(date_of_quiz=quiz_args["date_of_quiz"],
                        time_duration=quiz_args["time_duration"],
                        total_marks=quiz_args["total_marks"],
                        qualifying_marks=quiz_args["qualifying_marks"],
                        remarks=quiz_args.get('remarks'),
                        chapter_id=chap_id)
        
        db.session.add(quiz)
        db.session.commit()

        return {
            "message":"Quiz added successfully!"
        }

        
        
    @auth_required('token')
    @roles_required('admin')
    def put(self,quiz_id):
        quiz_args=quiz_parser.parse_args()

        if quiz_args["total_marks"] < 0 or quiz_args["qualifying_marks"] < 0:
            return {"message": "Marks cannot be negative"}, 400


        if quiz_args["qualifying_marks"] > quiz_args["total_marks"]:
            return {"message": "Qualifying marks cannot exceed total marks"}, 400

        quiz=Quiz.query.get(quiz_id)

        if not quiz:
            return {"message": "Quiz not found!"}, 404

        quiz.date_of_quiz = quiz_args["date_of_quiz"]
        quiz.time_duration = quiz_args["time_duration"]
        quiz.total_marks = quiz_args["total_marks"]
        quiz.qualifying_marks = quiz_args["qualifying_marks"]
        quiz.remarks = quiz_args.get("remarks")

        
        db.session.commit()

        return {
                "message":"Quiz Updated successfully!"
            }

        
        
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self,quiz_id):
        quiz=Quiz.query.get(quiz_id)
        if quiz:
            db.session.delete(quiz)
            db.session.commit()
            return {
                "message":"Quiz deleted successfully!"
            }

        return {
            "message":"Quiz not found!"
        },404


class QuestionApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self,quiz_id):
        questions=Questions.query.filter_by(quiz_id=quiz_id).all()
        questions_json=[]

        for ques in questions:
            this_ques={}

            this_ques["id"]=ques.id
            this_ques["question_statement"]=ques.question_statement
            this_ques["option_1"]=ques.option_1
            this_ques["option_2"]=ques.option_2
            this_ques["option_3"]=ques.option_3
            this_ques["option_4"]=ques.option_4
            this_ques["answer_option_no"]=ques.answer_option_no
            this_ques["answer"]=ques.answer

            questions_json.append(this_ques)
        
        if questions_json:
            return questions_json
        
        return {
            "message":"No questions are added to this quiz!"
        },404
        
    @auth_required('token')
    @roles_required('admin')
    def post(self,quiz_id):
        ques_args=ques_parser.parse_args()

        if ques_args["answer_option_no"] <= 0 or ques_args["answer_option_no"] > 4:
            return {"message": "Answer option number must be between 1 to 4"}, 400
        
        if ques_args["answer"]!=ques_args["option_"+str(ques_args["answer_option_no"])]:
            return {"message": "Answer does not correspond to the Answer option number"}, 400

        
        question=Questions(question_statement=ques_args["question_statement"],
                        option_1=ques_args["option_1"],
                        option_2=ques_args["option_2"],
                        option_3=ques_args["option_3"],
                        option_4=ques_args["option_4"],
                        answer_option_no=ques_args["answer_option_no"],
                        answer=ques_args["answer"],
                        quiz_id=quiz_id)
        
        db.session.add(question)
        db.session.commit()

        return {
            "message":"Question added successfully"
        }
        
    @auth_required('token')
    @roles_required('admin')
    def put(self,question_id):
        ques_args=ques_parser.parse_args()

        if ques_args["answer_option_no"] <= 0 or ques_args["answer_option_no"] > 4:
            return {"message": "Answer option number must be between 1 to 4"}, 400
        
        if ques_args["answer"]!=ques_args["option_"+str(ques_args["answer_option_no"])]:
            return {"message": "Answer does not correspond to the Answer option number"}, 400

        question=Questions.query.get(question_id)

        if not question:
            return {"message": "Question not found!"}, 404

        question.question_statement=ques_args["question_statement"]
        question.option_1=ques_args["option_1"]
        question.option_2=ques_args["option_2"]
        question.option_3=ques_args["option_3"]
        question.option_4=ques_args["option_4"]
        question.answer_option_no=ques_args["answer_option_no"]
        question.answer=ques_args["answer"]

        
        db.session.commit()

        return {
                "message":"Question Updated successfully"
            }

        
        
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self,question_id):
        question=Questions.query.get(question_id)
        if question:
            db.session.delete(question)
            db.session.commit()
            return {
                "message":"Question deleted successfully!"
            }

        return {
            "message":"Question not found!"
        },404

















api.add_resource(SubjectApi,'/api/get_sub','/api/add_sub',
                            '/api/update_sub/<int:sub_id>',
                            '/api/delete_sub/<int:sub_id>')

api.add_resource(ChapterApi,'/api/get_chap/<int:sub_id>',
                            '/api/add_chap/<int:sub_id>',
                            '/api/update_chap/<int:chap_id>',
                            '/api/delete_chap/<int:chap_id>')

api.add_resource(QuizApi,'/api/get_quiz/<int:chap_id>',
                            '/api/add_quiz/<int:chap_id>',
                            '/api/update_quiz/<int:quiz_id>',
                            '/api/delete_quiz/<int:quiz_id>')

api.add_resource(QuestionApi,'/api/get_question/<int:quiz_id>',
                            '/api/add_question/<int:quiz_id>',
                            '/api/update_question/<int:question_id>',
                            '/api/delete_question/<int:question_id>')

                    

