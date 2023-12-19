-- Crear la base de datos
CREATE DATABASE humedadp;

-- Usar la base de datos
USE humedadp;

drop table encendido;

-- Crear la tabla humedad
CREATE TABLE humedad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    humedad DECIMAL(5,2),
    fecha DATE,
    hora TIME
);

-- Crear la bandera encendido
CREATE TABLE encendido (
    encendido CHAR(2)
);


CREATE TABLE humedadp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    humedad DECIMAL(5,2),
    fecha DATE,
    hora TIME,
    estaciones VARCHAR(50)
);

