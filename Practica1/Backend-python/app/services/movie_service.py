from app.repositories.movie_repository import get_all_movies

def list_movies():
    movies = get_all_movies()

    result = []
    for m in movies:
        result.append({
            "id_pelicula": m[0],
            "titulo": m[1],
            "director": m[2],
            "anio_estreno": m[3],
            "url_contenido": m[4],
            "poster": m[5],
            "estado": m[6]
        })

    return result