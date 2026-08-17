# Encriptación
import hashlib
import re
import time

# Repositorio
from app.repositories.user_repository import find_by_email, create_user

# S3 uploader
from app.utils.s3_upload import upload_profile_image

# Configuración AWS
from app.config import Config


# ==============================
# UTILIDADES
# ==============================

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()


def validar_correo(correo):
    return re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", correo)


# ==============================
# REGISTRO
# ==============================

def register_user(data, file):

    correo = data.get("correo")
    nombre = data.get("nombre_completo")
    password = data.get("password")
    confirm = data.get("confirm_password")

    # Validaciones
    if not correo or not nombre or not password or not confirm:
        raise Exception("Todos los campos son obligatorios")

    if not validar_correo(correo):
        raise Exception("Formato de correo inválido")

    if password != confirm:
        raise Exception("Las contraseñas no coinciden")

    if find_by_email(correo):
        raise Exception("El correo ya está registrado")

    # Encriptar contraseña con MD5 (obligatorio en práctica)
    hashed_password = hash_password(password)

    # Subir imagen a S3 si existe
    foto_key = None

    if file:
        foto_key = upload_profile_image(file)

    # Guardar usuario en BD
    create_user(nombre, correo, hashed_password, foto_key)

    return {
        "success": True,
        "message": "Usuario registrado correctamente"
    }


# ==============================
# LOGIN
# ==============================

def login_user(data):

    correo = data.get("correo")
    password = data.get("password")

    if not correo or not password:
        raise Exception("Correo y contraseña son obligatorios")

    if not validar_correo(correo):
        raise Exception("Formato de correo inválido")

    hashed_password = hash_password(password)

    user = find_by_email(correo)

    if not user:
        raise Exception("Usuario no encontrado")

    # Estructura esperada de la tabla:
    # id_usuario (0)
    # correo (1)
    # nombre_completo (2)
    # password (3)
    # foto_perfil (4)

    if user[3] != hashed_password:
        raise Exception("Contraseña incorrecta")

    # Construir URL pública de la imagen
    base_url = f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com"
    foto_url = f"{base_url}/{user[4]}" if user[4] else None

    return {
        "success": True,
        "message": "Login exitoso",
        "user": {
            "id_usuario": user[0],
            "correo": user[1],
            "nombre_completo": user[2],
            "foto_perfil": foto_url
        }
    }