from app.config import get_connection

def find_by_id(id_usuario):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_usuario,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def update_profile(id_usuario, nombre, foto):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE usuarios
        SET nombre_completo = %s,
            foto_perfil = %s
        WHERE id_usuario = %s
        """,
        (nombre, foto, id_usuario)
    )
    conn.commit()
    cur.close()
    conn.close()

def find_by_email(email):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM usuarios WHERE correo = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def create_user(nombre_completo, correo, password_hash, foto_key):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO usuarios (nombre_completo, correo, password, foto_perfil)
        VALUES (%s, %s, %s, %s)
        RETURNING id_usuario;
    """, (nombre_completo, correo, password_hash, foto_key))

    user_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()
    conn.close()

    return user_id