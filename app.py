from datetime import date
from flask import Flask
from application.dbase import db
from application.models import User, Role
from application.resources import api
from application.config import LocalDevConfig
from flask_security import Security,SQLAlchemyUserDatastore
from werkzeug.security import check_password_hash,generate_password_hash



def create_app():
    app=Flask(__name__)
    app.config.from_object(LocalDevConfig)
    db.init_app(app)
    api.init_app(app)
    datastore=SQLAlchemyUserDatastore(db,User,Role)
    app.security=Security(app,datastore)
    app.app_context().push()

    return app

app=create_app()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name='admin',description='Quiz master(Super User of the Application)')
    app.security.datastore.find_or_create_role(name='user',description='Normal user of the application')
    db.session.commit()

    if not app.security.datastore.find_user(email='adminhema57@gmail.com'):
        app.security.datastore.create_user(email='adminhema57@gmail.com',password=generate_password_hash('Gh@57'),
                                           full_name='Hemalatha',qualification='Btech',
                                           dob=date(2006,4,7),roles=['admin'])
    
    if not app.security.datastore.find_user(email='giridhar75@gmail.com'):
        app.security.datastore.create_user(email='giridhar75@gmail.com',
                                           password=generate_password_hash('Gh@57'),
                                           full_name='Giridhar',qualification='Btech',
                                           dob=date(1999,6,5),roles=['user'])
        
    db.session.commit()
    

from application.routes import *

if __name__=="__main__":
    app.run()



