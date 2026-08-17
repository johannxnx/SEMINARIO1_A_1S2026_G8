from flask import Blueprint, jsonify
from app.services.movie_service import list_movies
import os

movie_bp = Blueprint("movie_bp", __name__)

@movie_bp.route("/", methods=["GET"])
def get_movies():
    try:
        movies = list_movies()
        bucket = os.getenv("AWS_BUCKET_NAME")
        region = os.getenv("AWS_REGION")

        base_url = f"https://{bucket}.s3.{region}.amazonaws.com"

        data = []
        for m in movies:
            data.append({
                "id_pelicula": m["id_pelicula"],
                "titulo": m["titulo"],
                "director": m["director"],
                "anio_estreno": m["anio_estreno"],
                "poster_url": f"{base_url}/{m['poster']}",
                "url_contenido": m["url_contenido"],
                "estado": m["estado"],
                "is_available": m["estado"] == "Disponible"
            })

        return jsonify({
            "success": True,
            "total": len(data),
            "data": data
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500