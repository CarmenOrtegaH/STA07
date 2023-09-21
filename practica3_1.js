function obtenerDirector() {
    var titulo = document.getElementById("tituloPelicula").value;
    var peticion = "http://wwww.omdbapi.com/?apikey=b0560da&s=" + titulo;
    
    fetch(peticion)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })
        .then(function(data) {
            // Almacena el JSON de la respuesta en una variable
            var respuestaJson = data;

            // Hacer algo con la respuesta JSON (por ejemplo, mostrarla en la consola)
            console.log(respuestaJson);

            // También puedes acceder a datos específicos, por ejemplo, los resultados
            var resultados = respuestaJson.Search;
            if (resultados) {
                console.log("Resultados:", resultados);
            }

        })
        .catch(function(error) {
            console.error("Error en la solicitud a la API: " + error.message);
        });
}
