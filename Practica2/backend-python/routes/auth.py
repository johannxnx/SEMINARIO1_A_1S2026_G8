import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from config.db import get_connection
from config.s3 import get_s3_client
from middleware.auth import auth_required
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id):
    payload = {
        'id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')

# POST /api/auth/register
@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if not all([username, email, password, confirm_password]):
        return jsonify({'error': 'Todos los campos son requeridos'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Las contraseñas no coinciden'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Verificar si ya existe
        cur.execute('SELECT id FROM users WHERE username = %s OR email = %s', (username, email))
        if cur.fetchone():
            return jsonify({'error': 'Usuario o email ya registrado'}), 409

        # Encriptar contraseña
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Subir foto de perfil a S3
        profile_pic = None
        if 'profile_pic' in request.files:
            file = request.files['profile_pic']
            if file.filename:
                s3 = get_s3_client()
                key = f"profiles/{int(datetime.utcnow().timestamp())}_{file.filename}"
                s3.upload_fileobj(
                    file,
                    os.getenv('S3_BUCKET_FILES'),
                    key,
                    ExtraArgs={'ContentType': file.content_type}
                )
                profile_pic = f"https://{os.getenv('S3_BUCKET_FILES')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"

        # Insertar usuario
        cur.execute(
            'INSERT INTO users (username, email, password_hash, profile_pic) VALUES (%s, %s, %s, %s) RETURNING id, username, email, profile_pic',
            (username, email, password_hash, profile_pic)
        )
        user = cur.fetchone()
        conn.commit()

        token = generate_token(user[0])
        return jsonify({
            'token': token,
            'user': {'id': user[0], 'username': user[1], 'email': user[2], 'profile_pic': user[3]}
        }), 201

    except Exception as e:
        print(e)
        return jsonify({'error': 'Error en el servidor'}), 500
    finally:
        cur.close()
        conn.close()

# POST /api/auth/login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cur.fetchone()

        if not user:
            return jsonify({'error': 'Credenciales incorrectas'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return jsonify({'error': 'Credenciales incorrectas'}), 401

        token = generate_token(user[0])
        return jsonify({
            'token': token,
            'user': {'id': user[0], 'username': user[1], 'email': user[2], 'profile_pic': user[4]}
        })

    except Exception as e:
        print(e)
        return jsonify({'error': 'Error en el servidor'}), 500
    finally:
        cur.close()
        conn.close()

# GET /api/auth/me
@auth_bp.route('/me', methods=['GET'])
@auth_required
def me():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, username, email, profile_pic, created_at FROM users WHERE id = %s', (request.user_id,))
        user = cur.fetchone()
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        return jsonify({'id': user[0], 'username': user[1], 'email': user[2], 'profile_pic': user[3], 'created_at': str(user[4])})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error en el servidor'}), 500
    finally:
        cur.close()
        conn.close()