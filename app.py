from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import mysql.connector
import webbrowser

app = Flask(__name__)
app.secret_key = "tu_clave_secreta"  # Necesaria para usar `session`

def get_db_connection():
    return mysql.connector.connect(
            host="192.168.1.17",
            user="alumno",
            password="Informatica2023",
            database="gametrack")

@app.route('/main')
def main():
    if "usuario_id" not in session:
        return redirect(url_for("index"))

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, 
                   uj.favorito, uj.jugado, uj.platino
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()  # Guardamos los resultados en la variable juegos

        cursor.close()
        connection.close()

        return render_template('main.html', juegos=juegos)  # Pasamos los juegos al template
    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}"

@app.route('/played')
def played():
    if "usuario_id" not in session:
        return redirect(url_for("index"))

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios,
                   uj.favorito, uj.jugado, uj.platino
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s AND uj.jugado = TRUE
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return render_template('played.html', juegos=juegos)
    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}"

@app.route('/favorites')
def favorites():
    if "usuario_id" not in session:
        return redirect(url_for("index"))

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios,
                   uj.favorito, uj.jugado, uj.platino
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s AND uj.favorito = TRUE
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return render_template('favorites.html', juegos=juegos)
    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}"

@app.route('/platinos')
def platinos():
    if "usuario_id" not in session:
        return redirect(url_for("index"))

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios,
                   uj.favorito, uj.jugado, uj.platino
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s AND uj.platino = TRUE
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return render_template('platinos.html', juegos=juegos)
    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}"

@app.route('/api/games', methods=['GET'])
def api_games():
    if "usuario_id" not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(juegos)  # Devuelve los juegos en formato JSON
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500
   
@app.route('/api/delete_game/<int:juego_id>', methods=['DELETE'])
def delete_game(juego_id):
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # Asegúrate de que el cursor devuelva diccionarios

        # Eliminar la relación entre el usuario y el juego
        cursor.execute("DELETE FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))

        # Eliminar el juego de la tabla "juegos" si no está asociado a ningún otro usuario
        cursor.execute("SELECT COUNT(*) as count FROM usuarios_juegos WHERE juego_id = %s", (juego_id,))
        result = cursor.fetchone()
        if result['count'] == 0:
            cursor.execute("DELETE FROM juegos WHERE id = %s", (juego_id,))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'success': True})
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/api/mark_as_played/<int:juego_id>', methods=['POST'])
def mark_as_played(juego_id):
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT jugado FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))
        resultado = cursor.fetchone()

        if resultado is None:
            cursor.execute("INSERT INTO usuarios_juegos (usuario_id, juego_id, jugado) VALUES (%s, %s, %s)", (usuario_id, juego_id, True))
            nuevo_estado = True
        else:
            nuevo_estado = not resultado['jugado']
            cursor.execute("UPDATE usuarios_juegos SET jugado = %s WHERE usuario_id = %s AND juego_id = %s", (nuevo_estado, usuario_id, juego_id))

        connection.commit()

        cursor.execute("SELECT * FROM juegos j INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id WHERE uj.usuario_id = %s AND j.id = %s", (usuario_id, juego_id))
        juego = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'juego': juego})
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/api/mark_as_favorite/<int:juego_id>', methods=['POST'])
def mark_as_favorite(juego_id):
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT favorito FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))
        resultado = cursor.fetchone()

        if resultado is None:
            cursor.execute("INSERT INTO usuarios_juegos (usuario_id, juego_id, favorito) VALUES (%s, %s, %s)", (usuario_id, juego_id, True))
            nuevo_estado = True
        else:
            nuevo_estado = not resultado['favorito']
            cursor.execute("UPDATE usuarios_juegos SET favorito = %s WHERE usuario_id = %s AND juego_id = %s", (nuevo_estado, usuario_id, juego_id))

        connection.commit()

        cursor.execute("SELECT * FROM juegos j INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id WHERE uj.usuario_id = %s AND j.id = %s", (usuario_id, juego_id))
        juego = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'juego': juego})
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/api/mark_as_platinum/<int:juego_id>', methods=['POST'])
def mark_as_platinum(juego_id):
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT platino FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))
        resultado = cursor.fetchone()

        if resultado is None:
            cursor.execute("INSERT INTO usuarios_juegos (usuario_id, juego_id, platino) VALUES (%s, %s, %s)", (usuario_id, juego_id, True))
            nuevo_estado = True
        else:
            nuevo_estado = not resultado['platino']
            cursor.execute("UPDATE usuarios_juegos SET platino = %s WHERE usuario_id = %s AND juego_id = %s", (nuevo_estado, usuario_id, juego_id))

        connection.commit()

        cursor.execute("SELECT * FROM juegos j INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id WHERE uj.usuario_id = %s AND j.id = %s", (usuario_id, juego_id))
        juego = cursor.fetchone()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'juego': juego})
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route("/add_game", methods=["GET", "POST"])
def add_game():
    if "usuario_id" not in session:  # Verificar si el usuario está autenticado
        return redirect(url_for("index"))  # Redirigir si no ha iniciado sesión

    print(f"usuario_id en sesión: {session.get('usuario_id')}")

    if request.method == "POST":
        # Obtener los datos del formulario
        nombre_juego = request.form.get("game-name")
        consola = request.form.get("game-console")
        anio_salida = request.form.get("game-year")
        imagen_url = request.form.get("game-image")
        comentarios = request.form.get("game-comments", "")  # Por defecto vacío si no hay comentarios
        usuario_id = session["usuario_id"]  # Obtener el usuario de la sesión

        # Verificar que los datos obligatorios no estén vacíos
        if not nombre_juego or not imagen_url or not consola or not anio_salida:
            return "Faltan datos obligatorios del juego", 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            # Insertar el juego en la tabla "juegos" con los nuevos campos
            query = """
                INSERT INTO juegos (nombre, consola, año_salida, imagen_del_juego, comentarios) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nombre_juego, consola, anio_salida, imagen_url, comentarios))
            juego_id = cursor.lastrowid  # Obtener el ID del juego recién insertado

            # Asociar el juego con el usuario en "usuarios_juegos"
            query = "INSERT INTO usuarios_juegos (usuario_id, juego_id) VALUES (%s, %s)"
            cursor.execute(query, (usuario_id, juego_id))

            connection.commit()
            cursor.close()
            connection.close()

            return redirect(url_for("main"))  # Redirige a la página principal
        except mysql.connector.Error as err:
            return f"Error en la base de datos: {err}"

    return render_template("add_game.html")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    nombre_usuario = request.form['nombre_usuario']
    contrasena = request.form['contrasena']  # Nombre correcto del campo
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (%s, %s)", 
            (nombre_usuario, contrasena)
        )
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Usuario '{nombre_usuario}' registrado con éxito.")
        return redirect(url_for('index'))
    except Exception as e:
        print(f"Error durante el registro: {e}")
        return "Error en el registro", 500

@app.route('/login', methods=['POST'])
def login():
    try:
        usuario = request.form.get('usuario')
        contraseña = request.form.get('password')

        if not usuario or not contraseña:
            return "Faltan datos para iniciar sesión", 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Ejecutar la consulta
        cursor.execute(
            "SELECT id, nombre_usuario FROM usuarios WHERE nombre_usuario = %s AND contrasena = %s",
            (usuario, contraseña)
        )
        usuario_db = cursor.fetchone()

        # ⚠ Solución clave: Consumir todos los resultados para evitar "Unread result found"
        cursor.fetchall()  # Esto asegura que no haya resultados pendientes en el cursor

        cursor.close()
        conn.close()

        if usuario_db:
            session['usuario_id'] = usuario_db['id']
            session['nombre_usuario'] = usuario_db['nombre_usuario']
            return redirect(url_for('main'))
        else:
            return "Usuario o contraseña incorrectos", 401

    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}", 500

    except Exception as e:
        return f"Error en el inicio de sesión: {str(e)}", 400

if __name__ == '__main__':
    conn = get_db_connection()
    if conn:
        print("Conexión inicial verificada: Base de datos accesible.")
        conn.close()
    else:
        print("Conexión inicial fallida: Verifica la configuración de la base de datos.")

    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))
    webbrowser.get("chrome").open("http://127.0.0.1:5001")
    app.run(debug=True, port=5001)