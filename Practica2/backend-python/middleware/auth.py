import jwt
import os
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token requerido'}), 401

        token = auth_header.split(' ')[1]
        try:
            decoded = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
            request.user_id = decoded['id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 403

        return f(*args, **kwargs)
    return decorated