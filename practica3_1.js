function obtenerDirector() {
    var titulo = document.getElementById("tituloPelicula").value;
    var peticion = `https://www.omdbapi.com/?apikey=b0560da&s=${titulo}`;
    
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

            // También puedes acceder a datos específicos, por ejemplo, los resultados
            var resultados = respuestaJson.Search;
            if (resultados) {
                console.log(resultados);
                var cuadroRespuestas = document.getElementById("cuadroRespuestas");
                var mensaje = `</br></h2> Todas las películas de ${titulo} </h2>`;
                mensaje += "<ul>";
                resultados.forEach(function(resultado) {
                    mensaje += `<li>${resultado.Title}</br>Año de la película: ${resultado.Year}</br></li>`;
                    mensaje += "<br>";
                });
                mensaje += "</ul>";
                cuadroRespuestas.innerHTML = mensaje;
            }

        })
        .catch(function(error) {
            console.error("Error en la solicitud a la API: " + error.message);
        });
}
