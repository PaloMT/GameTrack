from flask import Flask, request, jsonify, render_template
import mysql.connector
import webbrowser


app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    # Procesar el registro del usuario
    return "Registro exitoso"

@app.route('/login', methods=['POST'])
def login():
    # Procesar el inicio de sesión del usuario
    return "Inicio de sesión exitoso"

# Configuración de conexión a la base de datos
def get_db_connection():
    return mysql.connector.connect(
        host="192.168.1.17",
        user="alumno",
        password="Informatica2023",
        database="colegio"
    )


# Ruta principal
@app.route('/')
def index():
    return render_template('index.html')


# Ruta para agregar un alumno
@app.route('/add', methods=['POST'])
def add_student():
    try:
        data = request.json  # Captura datos JSON enviados por el cliente
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


