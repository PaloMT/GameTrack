from flask import Flask, request, jsonify, render_template, redirect, url_for, session, make_response
import mysql.connector
import webbrowser

app = Flask(__name__)
app.secret_key = "tu_clave_secreta"

def get_db_connection():
    return mysql.connector.connect(
            host="localhost",
            user="root",
            password="Palomita15*",
            database="gametrack")

@app.route('/main')
def main():
    if "usuario_id" not in session:  # Verifica si hay sesión activa
        return redirect(url_for("index"))
    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT j.id, j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios,
                uj.favorito, uj.jugado, uj.platino, 
                uj.disfrute as disfrute_rating,  # Renamed for clarity
                uj.dificultad as dificultad_rating,  # Renamed for clarity
                (SELECT COUNT(*) FROM usuarios_juegos uj2 
                    INNER JOIN juegos j2 ON uj2.juego_id = j2.id 
                    WHERE j2.nombre = j.nombre AND uj2.favorito = TRUE) AS like_count
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return render_template('main.html', juegos=juegos)
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
                uj.favorito, uj.jugado, uj.platino, 
                uj.disfrute as disfrute_rating,  # Renamed for clarity
                uj.dificultad as dificultad_rating,  # Renamed for clarity
                (SELECT COUNT(*) FROM usuarios_juegos uj2 
                    INNER JOIN juegos j2 ON uj2.juego_id = j2.id 
                    WHERE j2.nombre = j.nombre AND uj2.favorito = TRUE) AS like_count
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
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
                uj.favorito, uj.jugado, uj.platino, 
                uj.disfrute as disfrute_rating,  # Renamed for clarity
                uj.dificultad as dificultad_rating,  # Renamed for clarity
                (SELECT COUNT(*) FROM usuarios_juegos uj2 
                    INNER JOIN juegos j2 ON uj2.juego_id = j2.id 
                    WHERE j2.nombre = j.nombre AND uj2.favorito = TRUE) AS like_count
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
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
                uj.favorito, uj.jugado, uj.platino,
                uj.disfrute as disfrute_rating,
                uj.dificultad as dificultad_rating,
                (SELECT COUNT(*) FROM usuarios_juegos uj2 
                    INNER JOIN juegos j2 ON uj2.juego_id = j2.id 
                    WHERE j2.nombre = j.nombre AND uj2.favorito = TRUE) AS like_count
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
            SELECT j.nombre, j.imagen_del_juego, j.año_salida, j.comentarios,
                   (SELECT COUNT(*) FROM usuarios_juegos uj2 
                    INNER JOIN juegos j2 ON uj2.juego_id = j2.id 
                    WHERE j2.nombre = j.nombre AND uj2.favorito = TRUE) AS like_count
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s
        """
        cursor.execute(query, (usuario_id,))
        juegos = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(juegos)
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/api/delete_game/<int:juego_id>', methods=['DELETE'])
def delete_game(juego_id):
    usuario_id = session.get("usuario_id")
    if not usuario_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("DELETE FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))

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

        # Toggle the favorite status
        cursor.execute("SELECT favorito FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", (usuario_id, juego_id))
        resultado = cursor.fetchone()

        if resultado is None:
            cursor.execute("INSERT INTO usuarios_juegos (usuario_id, juego_id, favorito) VALUES (%s, %s, %s)", (usuario_id, juego_id, True))
            nuevo_estado = True
        else:
            nuevo_estado = not resultado['favorito']
            cursor.execute("UPDATE usuarios_juegos SET favorito = %s WHERE usuario_id = %s AND juego_id = %s", (nuevo_estado, usuario_id, juego_id))

        connection.commit()

        # Get the updated like count for the game name
        cursor.execute("""
            SELECT COUNT(*) AS like_count
            FROM usuarios_juegos uj
            INNER JOIN juegos j ON uj.juego_id = j.id
            WHERE j.nombre = (SELECT nombre FROM juegos WHERE id = %s) AND uj.favorito = TRUE
        """, (juego_id,))
        like_count = cursor.fetchone()['like_count']

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'favorito': nuevo_estado, 'like_count': like_count})
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
    if "usuario_id" not in session:
        return redirect(url_for("index"))

    if request.method == "POST":
        nombre_juego = request.form.get("game-name")
        consola = request.form.get("game-console")
        anio_salida = request.form.get("game-year")
        imagen_url = request.form.get("game-image")
        comentarios = request.form.get("game-comments", "")
        usuario_id = session["usuario_id"]

        if not nombre_juego or not imagen_url or not consola or not anio_salida:
            return "Faltan datos obligatorios del juego", 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            query = """
                INSERT INTO juegos (nombre, consola, año_salida, imagen_del_juego, comentarios) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nombre_juego, consola, anio_salida, imagen_url, comentarios))
            juego_id = cursor.lastrowid

            query = "INSERT INTO usuarios_juegos (usuario_id, juego_id) VALUES (%s, %s)"
            cursor.execute(query, (usuario_id, juego_id))

            connection.commit()
            cursor.close()
            connection.close()

            return redirect(url_for("main"))
        except mysql.connector.Error as errs:
            return f"Error en la base de datos: {err}"

    return render_template("add_game.html")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    nombre_usuario = request.form['nombre_usuario']
    contrasena = request.form['contrasena']
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
        return redirect(url_for('index'))
    except Exception as e:
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

        cursor.execute(
            "SELECT id, nombre_usuario FROM usuarios WHERE nombre_usuario = %s AND contrasena = %s",
            (usuario, contraseña)
        )
        usuario_db = cursor.fetchone()

        cursor.fetchall()

        cursor.close()
        conn.close()

        if usuario_db:
            session['usuario_id'] = usuario_db['id']
            session['nombre_usuario'] = usuario_db['nombre_usuario']
            print("Sesión iniciada:", session)  # <-- Agregar esto
            return redirect(url_for('main'))
        else:
            return "Usuario o contraseña incorrectos", 401

    except mysql.connector.Error as err:
        return f"Error en la base de datos: {err}", 500

    except Exception as e:
        return f"Error en el inicio de sesión: {str(e)}", 400

@app.route('/logout')
def logout():
    session.clear()
    response = redirect(url_for('index'))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/api/view_more_comments/<int:juego_id>', methods=['GET'])
def view_more_comments(juego_id):
    if "usuario_id" not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT comentarios
            FROM juegos j
            INNER JOIN usuarios_juegos uj ON j.id = uj.juego_id
            WHERE uj.usuario_id = %s AND j.id = %s
        """
        cursor.execute(query, (usuario_id, juego_id))
        juego = cursor.fetchone()

        cursor.close()
        connection.close()

        if juego:
            return jsonify({'success': True, 'comentarios': juego['comentarios']})
        else:
            return jsonify({'error': 'Juego no encontrado'}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/delete_account', methods=['POST'])
def delete_account():
    if "usuario_id" not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    usuario_id = session["usuario_id"]

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Delete user-related data from the database
        cursor.execute("DELETE FROM usuarios_juegos WHERE usuario_id = %s", (usuario_id,))
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (usuario_id,))

        connection.commit()
        cursor.close()
        connection.close()

        # Clear the session and redirect to the home page
        session.clear()
        return jsonify({"success": True, "redirect_url": url_for('index')})
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/api/set_rating/<int:juego_id>', methods=['POST'])
def set_rating(juego_id):
    if "usuario_id" not in session:
        return jsonify({"error": "Usuario no autenticado"}), 401

    data = request.get_json()
    tipo = data.get('tipo')  # 'disfrute' or 'dificultad'
    valor = data.get('valor')  # 1-5
    usuario_id = session["usuario_id"]

    if tipo not in ['disfrute', 'dificultad'] or not (1 <= valor <= 5):
        return jsonify(success=False), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Check if relationship exists
        cursor.execute("SELECT * FROM usuarios_juegos WHERE usuario_id = %s AND juego_id = %s", 
                      (usuario_id, juego_id))
        rel = cursor.fetchone()

        if not rel:
            # Create new with default 0 for the other rating
            cursor.execute(
                "INSERT INTO usuarios_juegos (usuario_id, juego_id, disfrute, dificultad) VALUES (%s, %s, %s, %s)",
                (usuario_id, juego_id, 
                 0 if tipo == 'dificultad' else valor, 
                 0 if tipo == 'disfrute' else valor)
            )
        else:
            # Update only the specified rating
            cursor.execute(
                f"UPDATE usuarios_juegos SET {tipo} = %s WHERE usuario_id = %s AND juego_id = %s",
                (valor, usuario_id, juego_id)
            )

        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify(success=True)
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500

@app.route('/update_rating', methods=['POST'])
def update_rating():
    if not current_user.is_authenticated:
        return jsonify({'success': False, 'message': 'Not authenticated'})

    data = request.get_json()
    juego_id = data.get('juego_id')
    rating_type = data.get('rating_type')
    rating_value = data.get('rating_value')

    # Find the user-game relationship
    user_game = db.session.query(usuarios_juegos).filter_by(
        usuario_id=current_user.id,
        juego_id=juego_id
    ).first()

    if not user_game:
        return jsonify({'success': False, 'message': 'Game not found for user'})

    if rating_type == 'disfrute':
        user_game.disfrute = rating_value
    elif rating_type == 'dificultad':
        user_game.dificultad = rating_value
    else:
        return jsonify({'success': False, 'message': 'Invalid rating type'})

    db.session.commit()
    return jsonify({'success': True})
    
if __name__ == '__main__':
    conn = get_db_connection()
    if conn:
        conn.close()

    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))
    webbrowser.get("chrome").open("http://127.0.0.1:5001")
    app.run(debug=True, port=5001)