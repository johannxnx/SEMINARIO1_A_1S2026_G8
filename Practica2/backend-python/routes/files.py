import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from config.db import get_connection
from config.s3 import get_s3_client
from middleware.auth import auth_required
from dotenv import load_dotenv

load_dotenv()

files_bp = Blueprint('files', __name__)

# GET /api/files
@files_bp.route('/', methods=['GET'])
@auth_required
def get_files():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM files WHERE user_id = %s ORDER BY created_at DESC', (request.user_id,))
        rows = cur.fetchall()
        files = [{'id': r[0], 'user_id': r[1], 'filename': r[2], 'file_type': r[3], 'file_url': r[4], 'file_size': r[5], 'created_at': str(r[6])} for r in rows]
        return jsonify(files)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al obtener archivos'}), 500
    finally:
        cur.close()
        conn.close()

# POST /api/files/upload
@files_bp.route('/upload', methods=['POST'])
@auth_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Archivo requerido'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'Archivo requerido'}), 400

    try:
        filename = file.filename
        content_type = file.content_type
        key = f"files/{request.user_id}/{int(datetime.utcnow().timestamp())}_{filename}"

        file_type = 'other'
        if content_type.startswith('image/'):
            file_type = 'image'
        elif content_type.startswith('text/'):
            file_type = 'text'

        file_data = file.read()
        file_size = len(file_data)

        s3 = get_s3_client()
        import io
        s3.upload_fileobj(
            io.BytesIO(file_data),
            os.getenv('S3_BUCKET_FILES'),
            key,
            ExtraArgs={'ContentType': content_type}
        )

        file_url = f"https://{os.getenv('S3_BUCKET_FILES')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"

        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO files (user_id, filename, file_type, file_url, file_size) VALUES (%s, %s, %s, %s, %s) RETURNING *',
            (request.user_id, filename, file_type, file_url, file_size)
        )
        row = cur.fetchone()
        conn.commit()

        return jsonify({'id': row[0], 'filename': row[2], 'file_type': row[3], 'file_url': row[4], 'file_size': row[5]}), 201

    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al subir archivo'}), 500
    finally:
        cur.close()
        conn.close()

# POST /api/files/upload-url — guardar URL de archivo subido por Lambda
@files_bp.route('/upload-url', methods=['POST'])
@auth_required
def upload_url():
    data = request.get_json()
    filename = data.get('filename')
    file_type = data.get('file_type')
    file_url = data.get('file_url')
    file_size = data.get('file_size')

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO files (user_id, filename, file_type, file_url, file_size) VALUES (%s, %s, %s, %s, %s) RETURNING *',
            (request.user_id, filename, file_type, file_url, file_size)
        )
        row = cur.fetchone()
        conn.commit()
        return jsonify({'id': row[0], 'filename': row[2], 'file_type': row[3], 'file_url': row[4]}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al guardar archivo'}), 500
    finally:
        cur.close()
        conn.close()

# DELETE /api/files/<id>
@files_bp.route('/<int:file_id>', methods=['DELETE'])
@auth_required
def delete_file(file_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM files WHERE id = %s AND user_id = %s RETURNING id', (file_id, request.user_id))
        row = cur.fetchone()
        conn.commit()
        if not row:
            return jsonify({'error': 'Archivo no encontrado'}), 404
        return jsonify({'message': 'Archivo eliminado correctamente'})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al eliminar archivo'}), 500
    finally:
        cur.close()
        conn.close()