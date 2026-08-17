from flask import Blueprint, request, jsonify
from config.db import get_connection
from middleware.auth import auth_required

tasks_bp = Blueprint('tasks', __name__)

# GET /api/tasks
@tasks_bp.route('/', methods=['GET'])
@auth_required
def get_tasks():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM tasks WHERE user_id = %s ORDER BY created_at DESC', (request.user_id,))
        rows = cur.fetchall()
        tasks = [{'id': r[0], 'user_id': r[1], 'title': r[2], 'description': r[3], 'completed': r[4], 'created_at': str(r[5]), 'updated_at': str(r[6])} for r in rows]
        return jsonify(tasks)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al obtener tareas'}), 500
    finally:
        cur.close()
        conn.close()

# POST /api/tasks
@tasks_bp.route('/', methods=['POST'])
@auth_required
def create_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'error': 'El título es requerido'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO tasks (user_id, title, description) VALUES (%s, %s, %s) RETURNING *',
            (request.user_id, title, description)
        )
        row = cur.fetchone()
        conn.commit()
        task = {'id': row[0], 'user_id': row[1], 'title': row[2], 'description': row[3], 'completed': row[4], 'created_at': str(row[5])}
        return jsonify(task), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al crear tarea'}), 500
    finally:
        cur.close()
        conn.close()

# PUT /api/tasks/<id>
@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@auth_required
def update_task(task_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            'UPDATE tasks SET title = COALESCE(%s, title), description = COALESCE(%s, description) WHERE id = %s AND user_id = %s RETURNING *',
            (title, description, task_id, request.user_id)
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        return jsonify({'id': row[0], 'title': row[2], 'description': row[3], 'completed': row[4]})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al editar tarea'}), 500
    finally:
        cur.close()
        conn.close()

# PATCH /api/tasks/<id>/complete
@tasks_bp.route('/<int:task_id>/complete', methods=['PATCH'])
@auth_required
def complete_task(task_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            'UPDATE tasks SET completed = NOT completed WHERE id = %s AND user_id = %s RETURNING *',
            (task_id, request.user_id)
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        return jsonify({'id': row[0], 'title': row[2], 'completed': row[4]})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al actualizar tarea'}), 500
    finally:
        cur.close()
        conn.close()

# DELETE /api/tasks/<id>
@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@auth_required
def delete_task(task_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM tasks WHERE id = %s AND user_id = %s RETURNING id', (task_id, request.user_id))
        row = cur.fetchone()
        conn.commit()
        if not row:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        return jsonify({'message': 'Tarea eliminada correctamente'})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error al eliminar tarea'}), 500
    finally:
        cur.close()
        conn.close()