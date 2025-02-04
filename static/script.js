// Función para agregar un alumno
document.getElementById('addStudent').addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const clase = document.getElementById('clase').value;


    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, nombre, clase }),
        });


        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error al agregar alumno: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar alumno');
    }
});


// Función para obtener la lista de alumnos
document.getElementById('getStudents').addEventListener('click', async () => {
    try {
        const response = await fetch('/students', { method: 'GET' });
        const students = await response.json();
        if (response.ok) {
            let studentList = '';
            students.forEach((student) => {
                studentList += `${student.id} - ${student.nombre} - ${student.clase}\n`;
            });
            alert(studentList);
        } else {
            alert(`Error al obtener alumnos: ${students.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener alumnos');
    }
});
