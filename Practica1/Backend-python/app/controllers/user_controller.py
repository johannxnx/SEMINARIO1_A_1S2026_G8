# Importar herramientas de Flask para crear rutas y manejar respuestas
from flask import Blueprint, request, jsonify
# Importar servicio de usuario
from app.services.user_service import update_profile

# Crear blueprint para las rutas de usuario
user_bp = Blueprint("user", __name__)

# Definir ruta PUT para actualizar perfil de usuario
@user_bp.route("/profile", methods=["PUT"])
def profile_update():
    try:
        result = update_profile(request.form, request.files.get("foto"))
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400