from flask import Flask, request, jsonify, render_template, redirect, url_for
import mysql.connector
import bcrypt
import webbrowser

app = Flask(__name__)

# Configuración de conexión a la base de datos
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="192.168.1.17",
            user="alumno",
            password="Informatica2023",
            database="estudio_ccii_pa_g4"
        )
        print("Conexión a la base de datos establecida correctamente.")
        return conn
    except mysql.connector.Error as err:
        print(f"Error de conexión a la base de datos: {err}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    nombre_usuario = request.form['nombre_usuario']
    contrasena = request.form['contrasena']
    hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (%s, %s)",
                (nombre_usuario, hashed_password)
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
    nombre_usuario = request.form['usuario']
    contrasena = request.form['password']

    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM usuarios WHERE nombre_usuario = %s", (nombre_usuario,)
            )
            user = cursor.fetchone()
            cursor.close()
            conn.close()

            if user and bcrypt.checkpw(contrasena.encode('utf-8'), user['contrasena'].encode('utf-8')):
                print(f"Inicio de sesión exitoso para el usuario '{nombre_usuario}'.")
                return redirect(url_for('index'))
            else:
                print("Inicio de sesión fallido: usuario o contraseña incorrectos.")
                return "Usuario o contraseña incorrectos", 401
    except Exception as e:
        print(f"Error durante el inicio de sesión: {e}")
        return "Error en el inicio de sesión", 500

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
