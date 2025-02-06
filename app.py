from flask import Flask, request, jsonify, render_template
import mysql.connector
import webbrowser

app = Flask(__name__)

try:
    conn = mysql.connector.connect(
        host="192.168.1.17",
        user="alumno",
        password="Informatica2023",
        database="estudio_ccii_pa_g4"
    )
    if conn.is_connected():
        print("✅ Conexión establecida con éxito.")
    conn.close()
except mysql.connector.Error as e:
    print(f"❌ Error de conexión: {e}")

@app.route('/')
def index():
    """Ruta de inicio: muestra el template principal."""
    return render_template('index.html')

# Ruta para registrar un usuario
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        nombre_usuario = data.get('nombre_usuario')
        contrasena = data.get('contrasena')
        
        if not nombre_usuario or not contrasena:
            return jsonify({"error": "Faltan campos requeridos"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (%s, %s)",
            (nombre_usuario, contrasena)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para el inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        nombre_usuario = data.get('nombre_usuario')
        contrasena = data.get('contrasena')

        if not nombre_usuario or not contrasena:
            return jsonify({"error": "Faltan campos requeridos"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM usuarios WHERE nombre_usuario = %s AND contrasena = %s",
            (nombre_usuario, contrasena)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": f"Bienvenido {nombre_usuario}"}), 200
        else:
            return jsonify({"error": "Nombre de usuario o contraseña incorrectos"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para agregar un alumno
@app.route('/add', methods=['POST'])
def add_student():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO alumno (id, nombre, clase) VALUES (%s, %s, %s)",
            (data['id'], data['nombre'], data['clase'])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Alumno agregado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Ruta para obtener la lista de alumnos
@app.route('/students', methods=['GET'])
def get_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM alumno")
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Registrar la ruta manual de Google Chrome
    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))
   
    webbrowser.get("chrome").open("http://127.0.0.1:5001")
    app.run(debug=True, port=5001)
