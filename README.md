# Intranet Meltec Comunicaciones S.A

Proyecto de inicio de intranet para Meltec Comunicaciones S.A

![Logo](https://meltec.com.co/wp-content/uploads/2023/10/LOGO-ANIMADO-MELTEC-COLOR.gif)
![Laravel](https://onlinecode.org/wp-content/uploads/2021/07/laravel9-php-framework-4.png)

# ¡¡AVISO DE MANTENIMIENTO!!

A partir del proximo 13 de octubre, la plataforma se encontrara fuera de servicio al menos durante 30 minutos, esto con el fin de realizar correcciones y mantenimiento a la plataforma, integracion de nuevas funciones, Correccion de errores, bugs y vulneravilidades, etc. 

Este procedimiento se repetira cada Viernes despues de las 4:30 P.M (GMT-5 - BOGOTA/AMERICA), esto con el fin de no interrumpir las actividades de la plataforma.

Esta condicion tambien aplica para las paginas desarrolladas por el equipo de desarrollo interno de Meltec Comunicaciones S.A 

- [Meltec Comunicaciones S.A](https//meltec.com.co)
- [Ulefone Colombia](https://ulefone.com.co)

## Autores

- [@lolesterno](https://github.com/Lolesterno)
- [@meltecTi](https://github.com/MeltecTi)

#Instrucciones de instalacion:

    -Paso 1: Clonacion del repositorio.
        Para la clonacion del repositorio usa el siguiente comando: git clone https://github.com/MeltecTi/intrameltec.git
    -Paso 2: Instalacion de dependencias PHP y Node.js
        Para la instalacion de PHP se requiere Composer ('https://getcomposer.org/download/')
        Para la instalacion de las dependencias usar el siguiente comando: composer install, despues usar composer update y esperar a que se instale las dependencias
        Clonar las variables .env (Entregadas en correo)
        Instalar las dependencias de desarrollo con Node en el siguiente comando: npm i, npm update
    -Paso 3: Clonar la base de datos:
        Crear la base de datos en local con el nombre de base de datos que se tiene en la variable de entorno del archivo .env DB_DATABASE
        Ajustar las credenciales DB_USERNAME y DB_PASSWORD a las credenciales de su servido de base de datos (Usar MySQL)
        Una vez instaladas todas las dependencias de PHP utilizar el comando: php artisan migrate para crear todas las tablas
        


## Tech Stack

**Cliente:** React, Inertia, Tailwind

**Servidor:** NodeJS V18, Laravel V10


## Support

Para soporte o dudas contactar al siguiente correo: *desarrollo@meltec.com.co*
