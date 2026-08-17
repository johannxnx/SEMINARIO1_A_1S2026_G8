from app.repositories.user_repository import find_by_id, update_profile as repo_update_profile
from app.services.auth_service import hash_password
from app.utils.s3_upload import upload_profile_image


def update_profile(data, file):

    id_usuario = data.get("id_usuario")
    nombre = data.get("nombre_completo")
    password_actual = data.get("password_actual")

    if not id_usuario or not password_actual:
        raise Exception("Datos incompletos")

    user = find_by_id(id_usuario)

    if not user:
        raise Exception("Usuario no encontrado")

    hashed = hash_password(password_actual)

    if user[3] != hashed:
        raise Exception("Contraseña actual incorrecta")

    # 🔥 Subir nueva foto si existe
    if file:
        foto_key = upload_profile_image(file)
    else:
        foto_key = user[4]

    repo_update_profile(
        id_usuario,
        nombre if nombre else user[2],
        foto_key
    )

    return {
        "success": True,
        "message": "Perfil actualizado correctamente"
    }