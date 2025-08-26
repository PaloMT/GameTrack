<h1>Gametrack</h1>

Base de datos del proyecto en sql:

DROP TABLE IF EXISTS usuarios_juegos;
DROP TABLE IF EXISTS juegos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS juegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    consola VARCHAR(255),
    año_salida INT,
    imagen_del_juego VARCHAR(500),
    comentarios TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

<h2>Explicación técnica</h2>

<h3>SQL</h3>
<h4>Eliminación de Tablas Existentes</h4>
Antes de crear las tablas, se eliminan en caso de que ya existan para evitar conflictos con versiones anteriores de la base de datos.

<h4>Creación de la Tabla “usuarios”</h4>
Esta tabla almacena la información de los usuarios registrados en el sistema.<br>
Campos:<br>
id: Identificador único de cada usuario, autoincremental.<br>
nombre_usuario: Nombre del usuario, obligatorio.<br>
contrasena: Contraseña del usuario, obligatoria.<br>


<h4>Creación de la Tabla “juegos”</h4>
Esta tabla almacena información sobre los juegos disponibles.<br>
Campos:<br>
id: Identificador único de cada juego, autoincremental.<br>
nombre: Nombre del juego, obligatorio.<br>
consola: Plataforma en la que se puede jugar (opcional).<br>
año_salida: Año de lanzamiento del juego.<br>
imagen_del_juego: Ruta o URL de una imagen del juego.<br>
comentarios: Campo para agregar notas o comentarios sobre el juego.<br>

<h4>Creación de la Tabla “usuarios_juegos”</h4>
Esta tabla intermedia gestiona la relación entre los usuarios y los juegos, permitiendo registrar cuáles han jugado y su estado en cada uno.<br>
Campos:<br>
id: Identificador único del registro, autoincremental.<br>
usuario_id: Referencia al usuario que posee o ha jugado un juego.<br>
juego_id: Referencia al juego asociado al usuario.<br>
favorito: Indica si el usuario ha marcado el juego como favorito (TRUE o FALSE).<br>
jugado: Indica si el usuario ha jugado el juego (TRUE o FALSE).<br>
platino: Indica si el usuario ha obtenido el trofeo platino (TRUE o FALSE).<br>
FOREIGN KEY (usuario_id): Relaciona con la tabla usuarios, con la restricción ON DELETE CASCADE (si un usuario se elimina, también se eliminan sus registros en esta tabla).<br>
FOREIGN KEY (juego_id): Relaciona con la tabla juegos, con ON DELETE CASCADE.<br>

<h3>App.py</h3>
<h4>Bibliotecas</h4><br>
Flask: Para crear la aplicación web y manejar rutas.<br>
mysql.connector: Para la conexión con la base de datos MySQL.<br>
webbrowser: Para abrir automáticamente la aplicación en un navegador web.<br>
Se define la aplicación Flask y una clave secreta para gestionar sesiones de usuario.<br>

<h4>Conexión a la Base de Datos</h4><br>
Se establece una función get_db_connection() que permite conectar la aplicación con una base de datos MySQL alojada en un servidor remoto.<br>

<h4>Rutas Principales</h4>
Ruta /main: verifica si el usuario está autenticado. Si no lo está, lo redirige a la página de inicio de sesión. Luego, obtiene la lista de juegos asociados al usuario desde la base de datos y los muestra en la interfaz.<br>
Rutas /played, /favorites, /platinos: Cada una de estas rutas filtra los juegos según si han sido marcados como jugados, favoritos o con platino por el usuario autenticado.<br>

API REST para la Gestión de Juegos<br>
Ruta /api/games:Devuelve la lista de juegos del usuario en formato JSON. Si el usuario no está autenticado, responde con un error 401.<br>
Ruta /api/delete_game/<int:juego_id>:Elimina un juego de la base de datos, asegurándose de que solo se borre si ningún otro usuario lo tiene registrado.
Rutas para marcar juegos<br>
/api/mark_as_played/<int:juego_id>: Marca o desmarca un juego como jugado.<br>
/api/mark_as_favorite/<int:juego_id>: Marca o desmarca un juego como favorito.<br>
/api/mark_as_platinum/<int:juego_id>: Marca o desmarca un juego como platino.<br>


Agregar Juegos a la Biblioteca<br>
La ruta /add_game permite agregar juegos a la base de datos. Si un usuario agrega un juego nuevo, se almacena y se asocia automáticamente a su cuenta.<br>

<h4>Gestión de Usuarios</h4><br>
La aplicación maneja usuarios mediante sesiones.<br>
/signup: Permite registrar nuevos usuarios.<br>
/login: Verifica credenciales e inicia sesión.<br>
/logout: Cierra la sesión y evita que se acceda sin autenticación.<br>

<h4>Ejecución de la Aplicación</h4><br>
Antes de iniciar la aplicación, se verifica la conexión a la base de datos. Luego, el navegador Google Chrome se abre automáticamente en la dirección http://127.0.0.1:5001, y el servidor Flask se ejecuta en el puerto 5001.

<h3>CSS</h3><br>
Para css tenemos 3 archivos: 
<h4>Styles.css</h4><br>
Es para la página que da estilo a la pestaña de log in/sign in. aquí se puede encontrar el archivo<br>
<h5>Diseño General del body</h5>
Elimina los márgenes y el padding predeterminados.
Usa display: flex para centrar el contenido en la pantalla.
min-height: 100vh asegura que el contenido ocupe toda la pantalla.
Usa una fuente personalizada (Jost).
Aplica un fondo con un degradado lineal de tonos azules y grises.
Contenedor Principal .main
Tamaño fijo de 350 x 500 px.
Usa una imagen de fondo que cubre completamente (background-size: cover).
border-radius: 10px; para esquinas redondeadas.
box-shadow: 5px 20px 50px #000; añade un efecto de sombra.
Ocultar el Checkbox #chk
Oculta el checkbox que se usa como selector para la animación.
Estilo del Formulario de Registro .signup
Ocupa todo el espacio del contenedor.
Estilo de las Etiquetas (label)
Texto blanco (color: #fff).
Tamaño grande (font-size: 2.3em).
Centrado con justify-content: center y display: flex.
Añade una transición suave al interactuar.
 Estilo de los Campos de Entrada (input)
width: 60% hace que los inputs sean más pequeños que el contenedor.
Color de fondo gris claro (#e0dede).
border-radius: 5px para bordes redondeados.
Botón de Enviar (button)
Ancho del 60% del contenedor.
Fondo color naranja claro (#F6B17A).
Cambio de color a gris oscuro (#424769) cuando se pasa el mouse (hover).
Estilo del Formulario de Inicio de Sesión .login
Usa un color de fondo claro (#eee).
border-radius: 60% / 10% le da una forma ovalada en la parte superior.
transform: translateY(-180px); lo desplaza hacia arriba inicialmente.
transition: .8s ease-in-out; añade una animación de desplazamiento.
Animaciones con el Checkbox #chk
Cuando se marca #chk, mueve .login hacia arriba.
Hace que la etiqueta del formulario de inicio de sesión vuelva a su tamaño normal.
Reduce el tamaño del título del formulario de registro.
2.-StylesAlex.css 
Da estilo a todas las demás páginas menos la de platinos y la de añadir platinos. Aquí encuentra el código necesario.
Estilos Generales
Se define la fuente principal como 'Lora', serif.
Se establece un color de fondo oscuro (#2D3250) con texto en blanco.
Se eliminan los márgenes y paddings predeterminados del cuerpo.

Encabezado y Navegación
header usa un fondo gris oscuro (#424769), con un h1 estilizado con un color crema (#d4c2b0) y tamaño de 2.5em.
nav tiene un fondo azul oscuro (#565e92), con enlaces estilizados en color crema. Al pasar el ratón, el subrayado aparece.

Diseño de Tarjetas de Juegos
game-list usa flexbox para distribuir los juegos de manera responsiva.
game-card tiene un fondo oscuro, bordes redondeados y un diseño centrado.
Las imágenes dentro de las tarjetas se ajustan al ancho y tienen bordes redondeados.
Los títulos de los juegos tienen un tamaño de 1.5em y un margen adecuado.

Botones Generales
Todos los botones tienen un diseño transparente con transiciones suaves.
button.played tiene un borde blanco y cambia de color al pasar el ratón.
Los botones de favorite y trophy cambian de color al activarse o al pasar el ratón.
delete cambia a rojo al pasar el ratón.

Botón Flotante para Agregar Juegos
add-game-btn es un botón circular fijo en la esquina inferior derecha.
Cambia de color al pasar el ratón para indicar interactividad.

Formulario de Agregado de Juegos
form-card usa un fondo oscuro con padding y bordes redondeados.
Los inputs y textarea tienen color de fondo azul oscuro y cambian al pasar el ratón o enfocar.
button mantiene el estilo general de botones con transiciones suaves.

Diseño Responsivo
En pantallas menores a 480px, form-card se ajusta al 90% del ancho disponible.

Detalles de Juegos y Botón "Mostrar Más"
toggle-details es un botón centrado, con un diseño compacto y bordes redondeados.
Cambia de color al pasar el ratón para indicar interactividad.
game-details está optimizado para evitar desbordamientos de texto.
Este CSS proporciona una interfaz moderna, intuitiva y visualmente atractiva para la organización de una biblioteca de videojuegos

3.-Styles2.css
Es el archivo que da estilos a la página de los platinos. Lo puede encontrar aquí
Estilos Generales (body)
Usa la fuente Poppins, una tipografía moderna y estilizada.
Establece un degradado de fondo en tonos oscuros (#1a1a2e a #16213e).
Texto blanco (color: #fff) para resaltar sobre el fondo oscuro.
text-align: center; centra el contenido de la página.
Encabezado (header)
Fondo oscuro semitransparente (rgba(26, 26, 46, 0.9)).
padding: 20px; proporciona espacio interno para el contenido.
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); añade un efecto de sombra.



Título del Encabezado (h1)
Usa un color platino (#C0C0C0) para el título, reforzando la temática de trofeos.
text-shadow añade un resplandor sutil.


Navegación (nav)
Agrega un margen arriba y abajo para separación.


Estilos de los enlaces de navegación (nav a)
Sin subrayado (text-decoration: none).
Color inicial platino (#C0C0C0), cambiando a azul brillante (#00aaff) al pasar el ratón.
transition: 0.3s; suaviza el cambio de color.
Sección de Logros (.achievements)
Usa display: flex para organizar los trofeos en filas y columnas.
flex-wrap: wrap; permite que los trofeos se ajusten automáticamente a diferentes tamaños de pantalla.
justify-content: center; centra los elementos en la página.
Tarjetas de Trofeos (.trophy-card)
Fondo semitransparente (rgba(255, 255, 255, 0.1)).
Borde platino (rgba(192, 192, 192, 0.5)).
border-radius: 12px; suaviza las esquinas.
box-shadow agrega un resplandor azul sutil.
Efecto al pasar el mouse (:hover)
La tarjeta se eleva (translateY(-5px)) para un efecto dinámico.
Aumenta la intensidad del resplandor azul.
Imagen del Trofeo
width: 80px; mantiene las imágenes pequeñas y uniformes.
margin-bottom: 10px; separa la imagen del texto.
Texto de la Tarjeta
Título (h2): Color blanco brillante para destacar.
Descripción (p): Color gris claro (#aaa) para menor protagonismo.
Botón "Añadir Platino" (.add-trophy)
Degradado azul de claro a oscuro.
border-radius: 8px; para bordes redondeados.
font-weight: bold; resalta el texto.
cursor: pointer; cambia el cursor a una mano.
Efecto al pasar el mouse
Cambia a un tono más oscuro al hacer hover.
Pie de Página (footer)
Mismo fondo que el header (rgba(26, 26, 46, 0.9)).
color: #aaa; hace que el texto sea más discreto.
font-size: 14px; mantiene el tamaño pequeño.



4.  JavaScript
scriptAlex.js
Este código es un sistema dinámico para gestionar una lista de juegos, permitiendo marcarlos como favoritos, jugados o completados con platino, así como eliminarlos. el código se encuentra aquí

Cargar los juegos al iniciar la página
Se ejecuta loadGames() cuando la página ha terminado de cargar.

Obtener la lista de juegos desde el servidor
Obtiene los juegos desde /api/games
Limpia la lista antes de agregar nuevos juegos
Crea una tarjeta para cada juego y la agrega al HTML

Crear una tarjeta de juego
Crea un div con la imagen, el nombre y el año del juego
Agrega los botones de acción: Favorito, Platino, Jugado y Eliminar
Muestra solo un resumen de los comentarios (100 caracteres)

Asignar acciones a los botones
Cada botón tiene un eventListener que hace una petición al servidor y actualiza la interfaz.


Marcar como favorito
 Envía una petición POST a /api/mark_as_favorite/:id
 Si la respuesta es correcta, actualiza la clase y el color del botón

Marcar como platino
 Envía una petición POST a /api/mark_as_platinum/:id
Cambia la apariencia del botón si el juego ahora tiene platino

Marcar como jugado
Manda una petición POST a /api/mark_as_played/:id
Actualiza el estado visual del botón

Eliminar un juego
Confirma antes de eliminar
Manda una petición DELETE a /api/delete_game/:id
Borra el juego de la lista y actualiza la página

Mostrar y ocultar comentarios
Muestra el comentario completo si es mayor de 100 caracteres
Alterna entre el resumen y el comentario completo


5.  HTML
1- add_game.html
Página que permite introducir juegos a la base datos. Accede a código en el siguiente enlace

Sección <head>
Se usa la fuente Poppins para el texto.
Se enlaza el archivo stylesAlex.css, donde estarán los estilos personalizados.
Se importan los iconos de Font Awesome, permitiendo agregar íconos como 🎮 (<i class="fas fa-gamepad"></i>).

Encabezado y Navegación
Se define un encabezado <header> con el título "Añadir Juego".
Se agrega un menú de navegación <nav> con enlaces a otras páginas:
{{ url_for('main') }}: Redirige a la página principal.
{{ url_for('played') }}: Redirige a la sección de juegos jugados.
{{ url_for('favorites') }}: Redirige a la sección de favoritos.
{{ url_for('platinos') }}: Redirige a los juegos con trofeo platino.
{{ url_for('logout') }}: Cierra la sesión del usuario.

Formulario para Añadir un Juego
El formulario (<form>) permite agregar un nuevo juego.
Se usa method="POST" porque los datos serán enviados al servidor.
Envía la información a la función add_game en Flask.
Campos del formulario:
game-name: Nombre del juego.
game-console: Consola en la que se juega.
game-year: Año de lanzamiento (limitado entre 1970 y 2030).
game-comments: Comentarios extra.
game-image: URL de una imagen del juego.

Botón de envío
Usa un ícono de 💾 guardado (<i class="fas fa-save"></i>).
Envia los datos cuando se presiona.

Script JavaScript
Vista previa de imagen
Detecta cambios en el campo game-image.
Si la URL es válida (termina en .jpeg, .jpg, .gif, .png), la muestra en la vista previa.
Si no es válida, la imagen desaparece.
Evita reenviar el formulario al recargar la página
Previene que el formulario se envíe dos veces si el usuario presiona F5.

2- favorites.html
Este archivo es una página HTML que muestra la lista de juegos marcados como favoritos en una biblioteca personal. al código lo encuentra pinchado aquí

Encabezado y Navegación
Título "Mi Biblioteca de Juegos".
Menú de navegación con enlaces generados dinámicamente por Flask.
Secciones disponibles: Inicio, Jugados, Favoritos, Platinos, Cerrar sesión.

Sección Principal: Lista de Juegos Favoritos
Se recorre la lista juegos enviada desde Flask ({% for juego in juegos %}).
Cada juego tiene una tarjeta (<div class="game-card">) con:
Imagen del juego (<img src="..." />).
Nombre (<h3>{{ juego.nombre }}</h3>).
Año de salida (<p>Año de salida: ...</p>).
Comentarios (juego.comentarios). Si es largo (>100 caracteres), aparece un botón "▼" para ver más.
Botones de acciones:
Favorito (<button class="favorite">).
Platino (<button class="trophy">).
Jugado (<button class="played">).
Eliminar (<button class="delete">).
Si un juego ya es favorito, platino o jugado, su botón tendrá la clase clicked, resaltándolo.

Botón para Agregar un Nuevo Juego
Este botón flotante "+" lleva a la página para añadir un juego.
Se usa data-url="{{ url_for('add_game') }}" para obtener dinámicamente la URL en Flask.

Scripts JavaScript
Redirección al formulario de añadir juego
Cuando el usuario hace clic en el botón "+", se extrae la URL desde data-url y se redirige allí.
Evitar reenvío del formulario al recargar la página
evita que el formulario se vuelva a enviar si se recarga la página.

Carga de Script Externo
Se carga un archivo JavaScript externo (scriptAlex.js)
Alternar estados de botones (favoritos, platinos, jugados).
Confirmar antes de eliminar un juego.
Expandir y contraer comentarios largos.

3- index.html
Este código HTML define una página de inicio de sesión y registro con un efecto deslizante (Slide Navbar). Enlace al código

Contenedor Principal <div class="main">
La clase "main" agrupa todo el contenido de la página.
Controla si se muestra la sección de "Sign Up" o "Login".
Se usa en combinación con CSS para hacer el efecto deslizante.

Sección de Registro (<div class="signup">)
Formulario para crear una cuenta.
Envía los datos a la ruta /signup en el backend (servidor).
Cuando se hace clic en "Sign up", el input checkbox (chk) cambia, mostrando la sección de registro.
Campo para ingresar el nombre de usuario.
Campo para ingresar la contraseña.
Botón para enviar el formulario.

Sección de Inicio de Sesión (<div class="login">)
Formulario de inicio de sesión.
action="/login" y method="POST": Envía los datos a la ruta /login en el backend.
Campos de usuario y contraseña (iguales a los de registro).
Botón para iniciar sesión.

Código JavaScript
Evita que el usuario vuelva a enviar el formulario si presiona el botón de "atrás" en el navegador.
Reemplaza la URL en el historial sin recargar la página.
Aplica el mismo comportamiento si el usuario usa el botón de "atrás" en su navegador.

4- main.html
Este código HTML(Link aquí) pertenece a una aplicación web llamada "Mi Biblioteca de Juegos", donde los usuarios pueden administrar su colección de videojuegos.

Encabezado y Barra de Navegación
Se muestra el título "Mi Biblioteca de Juegos".
La navegación tiene enlaces a diferentes secciones de la aplicación:
Inicio


Juegos jugados
Favoritos
Platinos (Juegos completados al 100%)
Cerrar sesión
Estos enlaces usan url_for('nombre_ruta'), lo que indica que es un proyecto basado en Flask (Python).

Lista de Juegos (<div class="game-list">)
Se usa un bucle en Jinja2 ({% for juego in juegos %}) para recorrer los juegos y mostrarlos.
Cada juego se muestra dentro de un <div class="game-card">.
Se incluye la imagen del juego, el nombre y el año de salida.
Los comentarios largos se muestran abreviados ([:100]), y se oculta el texto completo (display: none;).
Si hay más de 100 caracteres en los comentarios, aparece un botón para ver más.

Botones de Acción (<div class="actions">)
Botón de Favoritos: Si el juego está marcado como favorito (juego.favorito), la clase "clicked" se agrega para resaltar el botón.
Botón de Platino: Si el juego tiene un platino (juego.platino), también se resalta.
Botón "Marcar como Jugado"
Botón de Eliminar 

Botón para Agregar Juegos
Un botón con un símbolo "+" permite agregar un nuevo juego.
Su atributo data-url="{{ url_for('add_game') }}" indica que redirige a una ruta Flask (add_game).

JavaScript (scriptAlex.js y sesión de usuario)
Carga el archivo scriptAlex.js, que probablemente maneja eventos de los botones.
Cuando la página carga (DOMContentLoaded):
Se añade un evento al botón addGameBtn para redirigir al formulario de añadir juegos.
Se hace una solicitud fetch('/api/games') para verificar si el usuario tiene sesión activa.
Si la respuesta contiene un error, significa que el usuario no ha iniciado sesión, por lo que se redirige a la página principal ("/").

5- platinos.html
Este archivo HTML está diseñado para mostrar los juegos con trofeo de platino en una colección de videojuegos. Aquí está el código

Encabezado y Navegación (<header> y <nav>)
La barra de navegación contiene enlaces a otras secciones de la aplicación:
Inicio (main)
Juegos jugados (played)
Favoritos (favorites)
Cerrar sesión (logout)

Botones de Acción
Botón de Favorito: Si el juego es favorito, se activa la clase "clicked".
Botón de Platino: Ya que esta página es para juegos con platino, siempre estará activado.
Botón de "Marcar como Jugado".
 Botón de Eliminar.

JavaScript (scriptAlex.js)
Se carga scriptAlex.js (posiblemente maneja clics en botones).
Se previene el reenvío del formulario al recargar (history.replaceState).
Se llama a assignEventListeners(), pero este método no está definido en el código.

6 -played.html
Este código HTML es una página para gestionar y visualizar los juegos que han sido marcados como favoritos. EL código en el siguiente enlace

Navegación
Los enlaces permiten navegar entre las distintas secciones: Inicio, Favoritos, Platinos y Cerrar sesión.
Utiliza url_for para generar las URL dinámicamente con Flask.

Lista de Juegos Jugados
Se itera sobre una lista de juegos con el bloque {% for juego in juegos %}.
Cada juego tiene opciones de:
Favoritos: Sí el juego es favorito, se añade la clase clicked.
Platino: Similar a los favoritos, pero en este caso para los juegos con trofeo de platino.
Marcar como Jugado: Permite marcar el juego como jugado.
Eliminar: El botón para borrar el juego.

Botón para Añadir Juegos
Botón que redirige a la página de añadir juegos cuando se hace clic en él, usando la URL proporcionada por url_for('add_game').

Script para Añadir Juegos y Prevención de Recarga de Página
Se asocia un evento al botón de añadir juegos, redirigiendo al usuario a la página correspondiente cuando se hace clic.
Se utiliza window.history.replaceState para prevenir la recarga del formulario si se navega en la misma página.

Futuras mejoras
Gráfica de jugados en el mes
Botón de eliminar la cuenta
Modo claro
Página de error 404
Interacción entre usuarios, sección de comentarios y u contador de usuarios que han jugado y les ha gustado el juego



