document.getElementById('checkActivities').addEventListener('click', function () {
    var fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Por favor, carga un archivo Excel.');
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        // Supongamos que los datos están en la primera hoja
        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja a JSON
        var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Guardar los datos en Local Storage para que no se necesite cargar el archivo nuevamente
        localStorage.setItem('cronogramaData', JSON.stringify(jsonData));

        checkDates(jsonData);
    };

    reader.readAsArrayBuffer(file);
});

// Verificar las fechas y generar alertas
function checkDates(data) {
    var today = new Date();
    var upcomingDays = 3;  // Puedes cambiar el número de días de alerta
    var alertsDiv = document.getElementById('alerts');
    alertsDiv.innerHTML = '';

    var completedActivities = JSON.parse(localStorage.getItem('completedActivities')) || [];

    data.forEach(function (row, index) {
        if (index === 0) return;  // Saltar la fila de encabezados

        var date = new Date(row[0]);
        var activity = row[1];

        // Verificar si la actividad ya fue completada
        if (completedActivities.includes(activity)) return;

        if (date - today <= upcomingDays * 24 * 60 * 60 * 1000 && date >= today) {
            var alertMessage = 'La actividad "' + activity + '" está programada para ' + date.toDateString();
            var alertElement = document.createElement('p');
            alertElement.textContent = alertMessage;

            // Crear un botón para marcar la actividad como completada
            var completeButton = document.createElement('button');
            completeButton.textContent = 'Marcar como completada';
            completeButton.onclick = function () {
                completedActivities.push(activity);
                localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
                alertElement.remove();  // Eliminar la alerta visual
            };

            alertElement.appendChild(completeButton);
            alertsDiv.appendChild(alertElement);

            // Enviar notificación push (opcional)
            if (Notification.permission === "granted") {
                new Notification('Alerta de Actividad', { body: alertMessage });
            }
        }
    });
}

// Solicitar permisos para las notificaciones si no están concedidos
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Al cargar la página, verificar si ya hay datos guardados en Local Storage
window.onload = function () {
    var cronogramaData = JSON.parse(localStorage.getItem('cronogramaData'));
    if (cronogramaData) {
        checkDates(cronogramaData);
    }
};

