from app.repositories.playlist_repository import (
    find_movie_by_id,
    add_to_playlist,
    get_user_playlist,
    remove_from_playlist
)
from app.repositories.notification_repository import create_notification
import psycopg2
import os



def add_movie_to_playlist(id_usuario, id_pelicula):

    movie = find_movie_by_id(id_pelicula)

    if not movie:
        raise Exception("Película no existe")

    if movie[6] != "Disponible":
        raise Exception("La película no está disponible")

    try:
        result = add_to_playlist(id_usuario, id_pelicula)

    
        create_notification(
            id_usuario,
            "Película agregada a tu lista 🎬"
        )

        return result

    except psycopg2.errors.UniqueViolation:
        raise Exception("La película ya está en tu lista")


def list_user_playlist(id_usuario):

    movies = get_user_playlist(id_usuario)
    
    bucket = os.getenv("AWS_BUCKET_NAME")
    region = os.getenv("AWS_REGION")
    base_url = f"https://{bucket}.s3.{region}.amazonaws.com"

    result = []
    for m in movies:
        result.append({
            "id_pelicula": m[0],
            "titulo": m[1],
            "director": m[2],
            "anio_estreno": m[3],
            "url_contenido": m[4],
            "poster_url": f"{base_url}/{m[5]}",
            "estado": m[6]
        })

    return result


def delete_from_playlist(id_usuario, id_pelicula):
    remove_from_playlist(id_usuario, id_pelicula)