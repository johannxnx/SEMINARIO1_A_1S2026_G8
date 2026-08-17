-- CREACION DE BASE DE DATOS

CREATE DATABASE db_CloudCinema;


-- TABLA USUARIOS
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    
    -- Email único obligatorio
    correo VARCHAR(150) NOT NULL UNIQUE,
    
    nombre_completo VARCHAR(150) NOT NULL,
    
    -- Se almacenará en MD5
    password CHAR(32) NOT NULL,
    
    -- Solo se guarda la ruta, NO imagen binaria
    foto_perfil VARCHAR(255),
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLA PELICULAS

CREATE TABLE peliculas (
    id_pelicula SERIAL PRIMARY KEY,
    
    titulo VARCHAR(200) NOT NULL,
    
    director VARCHAR(150) NOT NULL,
    
    anio_estreno INT NOT NULL,
    
    -- URL externa (YouTube trailer)
    url_contenido TEXT NOT NULL,
    
    -- Ruta en S3 ejemplo:
    -- Fotos_Peliculas/pelicula1.jpg
    poster VARCHAR(255) NOT NULL,
    
    -- Estado controlado
    estado VARCHAR(20) NOT NULL,
    
    CONSTRAINT chk_estado 
    CHECK (estado IN ('Disponible', 'Proximamente')),

);


-- TABLA LISTA DE REPRODUCCION
-- Relación muchos a muchos
CREATE TABLE lista_reproduccion (
    
    id_usuario INT NOT NULL,
    id_pelicula INT NOT NULL,
    
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_usuario, id_pelicula),
    
    CONSTRAINT fk_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE,
    
    CONSTRAINT fk_pelicula
    FOREIGN KEY (id_pelicula)
    REFERENCES peliculas(id_pelicula)
    ON DELETE CASCADE
);


-- TABLA NOTIFICACIONES
CREATE TABLE notificaciones (
    
    id_notificacion SERIAL PRIMARY KEY,
    
    id_usuario INT NOT NULL,
    
    mensaje TEXT NOT NULL,
    
    leida BOOLEAN DEFAULT FALSE,
    
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notif_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);