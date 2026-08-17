from app.config import get_connection

def get_notifications_by_user(id_usuario):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id_notificacion, mensaje, leida, fecha
        FROM notificaciones
        WHERE id_usuario = %s
        ORDER BY fecha DESC
    """, (id_usuario,))

    notifications = cursor.fetchall()

    cursor.close()
    conn.close()

    return notifications


def create_notification(id_usuario, mensaje):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO notificaciones (id_usuario, mensaje)
        VALUES (%s, %s)
    """, (id_usuario, mensaje))

    conn.commit()

    cursor.close()
    conn.close()