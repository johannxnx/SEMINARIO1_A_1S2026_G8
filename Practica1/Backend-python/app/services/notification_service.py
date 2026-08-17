from app.repositories.notification_repository import get_notifications_by_user
from datetime import datetime

def format_time_ago(date):
    diff = (datetime.now() - date).total_seconds()

    if diff < 60:
        return "Hace unos segundos"
    if diff < 3600:
        return f"Hace {int(diff/60)} minutos"
    if diff < 86400:
        return f"Hace {int(diff/3600)} horas"
    return f"Hace {int(diff/86400)} días"


def list_notifications(id_usuario):
    notifications = get_notifications_by_user(id_usuario)

    result = []
    for n in notifications:
        result.append({
            "id_notificacion": n[0],
            "mensaje": n[1],
            "leida": n[2],
            "fecha": n[3],
            "fecha_formateada": format_time_ago(n[3])
        })

    return result