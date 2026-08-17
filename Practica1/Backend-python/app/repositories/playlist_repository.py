from app.config import get_connection
import psycopg2

def find_movie_by_id(id_pelicula):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM peliculas WHERE id_pelicula = %s",
        (id_pelicula,)
    )

    movie = cursor.fetchone()

    cursor.close()
    conn.close()

    return movie


def add_to_playlist(id_usuario, id_pelicula):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO lista_reproduccion (id_usuario, id_pelicula)
        VALUES (%s, %s)
        RETURNING *
        """,
        (id_usuario, id_pelicula)
    )

    conn.commit()
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result


def get_user_playlist(id_usuario):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT p.id_pelicula, p.titulo, p.director,
               p.anio_estreno, p.url_contenido,
               p.poster, p.estado
        FROM lista_reproduccion lr
        JOIN peliculas p ON lr.id_pelicula = p.id_pelicula
        WHERE lr.id_usuario = %s
        ORDER BY lr.fecha_agregado DESC
        """,
        (id_usuario,)
    )

    movies = cursor.fetchall()

    cursor.close()
    conn.close()

    return movies


def remove_from_playlist(id_usuario, id_pelicula):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM lista_reproduccion
        WHERE id_usuario = %s AND id_pelicula = %s
        """,
        (id_usuario, id_pelicula)
    )

    conn.commit()

    cursor.close()
    conn.close()