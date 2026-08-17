from flask import Flask
from flask_cors import CORS
from app.config import get_connection

from app.controllers.auth_controller import auth_bp
from app.controllers.user_controller import user_bp
from app.controllers.movie_controller import movie_bp
from app.controllers.playlist_controller import playlist_bp
from app.controllers.notification_controller import notification_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(movie_bp, url_prefix="/api/movies")
    app.register_blueprint(playlist_bp, url_prefix="/api/playlist")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    @app.route("/")
    def home():
        return {
            "success": True,
            "message": "CloudCinema API Python funcionando correctamente"
        }

    @app.route("/health")
    def health():
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            conn.close()
            return {"success": True, "message": "CloudCinema API Python funcionando correctamente"}
        except Exception as e:
            return {"success": False, "error": str(e)}, 500

    return app