from flask import Blueprint, jsonify
from app.services.notification_service import list_notifications

notification_bp = Blueprint("notification_bp", __name__)

@notification_bp.route("/<int:id_usuario>", methods=["GET"])
def get_notifications(id_usuario):
    try:
        notifications = list_notifications(id_usuario)

        return jsonify({
            "success": True,
            "unread_count": len([n for n in notifications if not n["leida"]]),
            "total": len(notifications),
            "data": notifications
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500