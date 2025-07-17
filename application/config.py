class Config():
    DEBUG=False
    SQLALCHEMY_TRACK_MODIFICATIONS=True

class LocalDevConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///dbv2.sqlite3"
    DEBUG=True

    #security Configuration
    SECRET_KEY="My-Secret-Key"
    SECURITY_PASSWORD_HASH="bcrypt"
    SECURITY_PASSWORD_SALT="My-Pass-Salt"
    WTF_CSRF_ENABLED=False
    SECURITY_TOKEN_AUTHENTICATION_HEADER="Token-for-Authentication"

