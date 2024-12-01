from app.db import db

class Tools(db.Model):
    __tablename__ = 'tools'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    api_key = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text)
    type = db.Column(db.String(255), nullable=False)
    channel = db.Column(db.String(255), nullable=False)
    data_schema = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __repr__(self):
        return f'<Tool {self.code}>'

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'url': self.url,
            'api_key': self.api_key,
            'description': self.description,
            'type': self.type,
            'channel': self.channel,
            'data_schema': self.data_schema,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }