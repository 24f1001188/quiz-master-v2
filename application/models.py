from .dbase import db
from flask_security import UserMixin,RoleMixin

class User(db.Model,UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(120),unique=True,nullable=False)
    password=db.Column(db.String(256),nullable=False)
    full_name=db.Column(db.String(150),nullable=False)
    qualification=db.Column(db.String(250))
    dob=db.Column(db.Date,nullable=False)
    #extra attributes

    fs_uniquifier=db.Column(db.String,unique=True,nullable=False) #used to create token(token->identification whether a particular user is allowed to access a particular endpoint)
    active=db.Column(db.Boolean,nullable=False) #can be usef to deactivate an user from using the application,by default every registered user is considered active

    roles=db.relationship('Role',backref='user',secondary='user_roles')
    scores=db.relationship('Scores',backref='user',cascade='all, delete-orphan')

    
class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,nullable=False)
    description=db.Column(db.String)

#many-to-many relationship b/w User and Role 
class UserRoles(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    role_id=db.Column(db.Integer,db.ForeignKey('role.id'))


class Subject(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(256),nullable=False)
    description=db.Column(db.String(500),nullable=False)

    chapters=db.relationship('Chapter',backref='subject',cascade='all, delete-orphan')

class Chapter(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    subject_id=db.Column(db.Integer,db.ForeignKey('subject.id',ondelete='CASCADE'),nullable=False)
    name=db.Column(db.String(256),nullable=False)
    description=db.Column(db.String(500),nullable=False)

    quizzes=db.relationship('Quiz',backref='chapter',cascade='all, delete-orphan')

class Quiz(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    chapter_id=db.Column(db.Integer,db.ForeignKey('chapter.id',ondelete='CASCADE'),nullable=False)
    date_of_quiz=db.Column(db.Date,nullable=False)
    time_duration=db.Column(db.Time,nullable=False)
    remarks=db.Column(db.String(500))
    total_marks=db.Column(db.Integer,nullable=False)
    qualifying_marks=db.Column(db.Integer,nullable=False)

    questions=db.relationship('Questions',backref='quiz',cascade='all, delete-orphan')
    scores=db.relationship('Scores',backref='quiz',cascade='all, delete-orphan')

class Questions(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    quiz_id=db.Column(db.Integer,db.ForeignKey('quiz.id',ondelete='CASCADE'),nullable=False)
    question_statement=db.Column(db.String(1000),nullable=False)
    option_1=db.Column(db.String(500),nullable=False)
    option_2=db.Column(db.String(500),nullable=False)
    option_3=db.Column(db.String(500),nullable=False)
    option_4=db.Column(db.String(500),nullable=False)
    answer_option_no=db.Column(db.Integer,nullable=False)
    answer=db.Column(db.String(500),nullable=False)

class Scores(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    quiz_id=db.Column(db.Integer,db.ForeignKey('quiz.id',ondelete='CASCADE'),nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id',ondelete='CASCADE'),nullable=False)
    time_stamp_of_event=db.Column(db.DateTime,nullable=False)
    total_scored=db.Column(db.Integer,nullable=False)
    is_passed=db.Column(db.Boolean,nullable=False)