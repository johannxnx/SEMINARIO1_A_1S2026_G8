# Importar herramientas de Flask para crear rutas y manejar respuestas
from flask import Blueprint, request, jsonify
# Importar servicios de autenticación
from app.services.auth_service import register_user, login_user

# Crear blueprint para las rutas de autenticación
auth_bp = Blueprint("auth", __name__)

# Definir ruta POST para registro de usuarios
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        # Llamar al servicio de registro con los datos del formulario y la foto
        result = register_user(request.form, request.files.get("foto"))
        # Retornar respuesta exitosa
        return jsonify(result), 200
    except Exception as e:
        # Capturar errores y retornar respuesta de error
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    

# Definir ruta POST para inicio de sesión
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        # Obtener datos JSON de la petición
        data = request.json
        # Llamar al servicio de login con los datos
        result = login_user(data)
        # Retornar respuesta exitosa
        return jsonify(result), 200
    except Exception as e:
        # Capturar errores y retornar respuesta de error
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400