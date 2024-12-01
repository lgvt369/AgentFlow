from flask import Flask
from .db import db
from config import Config
from .routes.tools import tools_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

from .models.tools import Tools

app.register_blueprint(tools_bp)