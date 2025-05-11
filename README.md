actual db

DROP TABLE IF EXISTS usuarios_juegos;
DROP TABLE IF EXISTS juegos;
DROP TABLE IF EXISTS usuarios;

-- Crear la tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear la tabla juegos
CREATE TABLE IF NOT EXISTS juegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    consola VARCHAR(255),
    año_salida INT,
    imagen_del_juego VARCHAR(500),
    comentarios TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear la tabla intermedia para relacionar usuarios con juegos
CREATE TABLE IF NOT EXISTS usuarios_juegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    juego_id INT,
    favorito BOOLEAN DEFAULT FALSE,
    jugado BOOLEAN DEFAULT FALSE,
    platino BOOLEAN DEFAULT FALSE,
    disfrute TINYINT CHECK (disfrute BETWEEN 1 AND 5),
    dificultad TINYINT CHECK (dificultad BETWEEN 1 AND 5),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (juego_id) REFERENCES juegos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
