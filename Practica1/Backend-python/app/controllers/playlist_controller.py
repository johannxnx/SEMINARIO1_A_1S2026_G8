from flask import Blueprint, request, jsonify
from app.services.playlist_service import (
    add_movie_to_playlist,
    list_user_playlist,
    delete_from_playlist
)

playlist_bp = Blueprint("playlist_bp", __name__)

# Agregar película a la playlist
@playlist_bp.route("/", methods=["POST"])
def add():
    try:
        data = request.json

        result = add_movie_to_playlist(
            data["id_usuario"],
            data["id_pelicula"]
        )

        return jsonify({
            "success": True,
            "message": "Película agregada a la lista",
            "data": result
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


# Obtener playlist del usuario
@playlist_bp.route("/<int:id_usuario>", methods=["GET"])
def get_user(id_usuario):
    try:
        playlist = list_user_playlist(id_usuario)

        return jsonify({
            "success": True,
            "total": len(playlist),
            "data": playlist
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


# Eliminar película de la playlist
@playlist_bp.route("/", methods=["DELETE"])
def remove():
    try:
        data = request.json

        delete_from_playlist(
            data["id_usuario"],
            data["id_pelicula"]
        )

        return jsonify({
            "success": True,
            "message": "Película eliminada de la lista"
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400