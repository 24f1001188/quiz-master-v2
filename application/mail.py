import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from jinja2 import Template

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "quizmaster@donotreply.in"
SENDER_PASSWORD = ""

def send_email(to_address, subject, message, content="html", attachment_file=None):   # default content -> html
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To'] = to_address
    msg['Subject'] = subject

    if content == "html":
        msg.attach(MIMEText(message, "html"))
    else:
        msg.attach(MIMEText(message, "plain"))

    if attachment_file:
        with open(attachment_file, 'rb') as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())

        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={attachment_file}")
        msg.attach(part)

    # Use Mailpit: no login required
    with smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT) as s:
        s.send_message(msg)

    return True



