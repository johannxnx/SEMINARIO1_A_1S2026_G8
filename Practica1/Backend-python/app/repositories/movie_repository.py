from app.config import get_connection

def get_all_movies():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id_pelicula, titulo, director, anio_estreno,
               url_contenido, poster, estado
        FROM peliculas
        ORDER BY id_pelicula DESC
    """)

    movies = cursor.fetchall()

    cursor.close()
    conn.close()

    return movies