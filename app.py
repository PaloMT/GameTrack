from flask import Flask, request, jsonify, render_template, redirect, url_for
import mysql.connector
import webbrowser

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
            host="192.168.1.17",
            user="alumno",
            password="Informatica2023",
            database="gametrack")

@app.route('/main')
def main():
    return render_template('main.html')
    
@app.route('/played')
def played():
    return render_template('played.html')

@app.route('/favorites')
def favorites():
    return render_template('favorites.html')

@app.route('/platinos')
def platinos():
    return render_template('platinos.html')

@app.route('/add_game')
def add_game():
    return render_template('add_game.html')
    
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
            "SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = %s AND contrasena = %s", 
            (usuario, contraseña)
        )
        usuario_db = cursor.fetchone()
        cursor.fetchall()
        cursor.close()
        conn.close()
        if usuario_db:
            return redirect('main')
        else:
            return "Usuario o contraseña incorrectos", 401
    except Exception as e:
        return f"Error en el inicio de sesión: {str(e)}", 400

if __name__ == '__main__':
    # Verificar la conexión antes de iniciar el servidor
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
