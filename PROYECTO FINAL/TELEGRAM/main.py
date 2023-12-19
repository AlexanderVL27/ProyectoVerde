# Importar librerias
import json
import requests

# Variables para el Token, la URL del chatbot y URL del NGROK
TOKEN = ""  # Cambialo por tu token
URLTEL = "https://api.telegram.org/bot" + TOKEN + "/"
TELEGRAM_CHAT_ID = 1589850480

# URL ngrok y ruta específica
URLserver_Humedad = "https://8d1d952a79382d38fb2f4e6f675aa7f9.serveo.net/hg"
URLserver_Estado = "https://8d1d952a79382d38fb2f4e6f675aa7f9.serveo.net/hve"
resHumedad = requests.get(URLserver_Humedad)
resEstado = requests.get(URLserver_Estado)


def update(offset):  # obtener actualizaciones de un bot de Telegram

    # Llamar al metodo getUpdates del bot, utilizando un offset
    # Telegram devolvera todos los mensajes con id IGUAL o SUPERIOR al offset
    respuesta = requests.get(URLTEL + "getUpdates" + "?offset=" + str(offset) + "&timeout=" + str(100))

    # Decodificar la respuesta recibida a formato UTF8
    mensajes_js = respuesta.content.decode("utf8")

    # Convertir el string de JSON a un diccionario de Python
    mensajes_diccionario = json.loads(mensajes_js)

    # Devolver este diccionario
    return mensajes_diccionario


def leer_mensaje(mensaje):  # procesar un mensaje recibido a través de una actualización de la API de Telegram

    # Extraer el texto, nombre de la persona e id del último mensaje recibido
    texto = mensaje["message"]["text"]
    persona = mensaje["message"]["from"]["first_name"]
    id_chat = mensaje["message"]["chat"]["id"]

    # Calcular el identificador unico del mensaje para calcular el offset
    id_update = mensaje["update_id"]

    # Devolver las dos id, el nombre y el texto del mensaje
    return id_chat, persona, texto, id_update


def enviar_mensaje(idchat, texto):
    # Llamar el metodo sendMessage del bot, pasando el texto y la id del chat
    requests.get(URLTEL + "sendMessage?text=" + texto + "&chat_id=" + str(idchat))


def enviar_notificacion(estado):
    requests.get(URLTEL + "sendMessage?text=" + "SENSOR ENCENDIDO: " + estado + "&chat_id=" + str(TELEGRAM_CHAT_ID))


def enviar_notificacion_umbral(umbral):
    requests.get(URLTEL + "sendMessage?text=" + "NOTIFICACIÓN: " + umbral + "&chat_id=" + str(TELEGRAM_CHAT_ID))


if resEstado.status_code == 200:
    previous_data = resEstado.json()  # datos en formato JSON
    print(previous_data)
else:
    print("Error al realizar la solicitud:", resEstado.status_code)

ultima_id = 0

# Inicialización de variables para seguimiento de cambios
previous_encendido = None
previous_humedad = None  # Agregamos una variable para rastrear la humedad anterior
esperando_umbral = False  # Inicializa la variable fuera del bucle
idchat_esperando_umbral = None
umbral = None  # Inicializa umbral fuera del bucle principal

while True:
    mensajes = update(ultima_id)

    try:
        response = requests.get(URLserver_Estado)
        response.raise_for_status()  # Lanza una excepción para errores HTTP
        data = response.json()[0] if isinstance(response.json(), list) else response.json()
    except requests.RequestException as e:
        print(f"Error al obtener el archivo JSON: {e}")
        continue  # Intenta nuevamente en el próximo ciclo

    # Obtén el valor actual del campo 'encendido'
    current_encendido = data.get('encendido')

    # Compara el estado actual con el estado anterior
    if current_encendido is not None and current_encendido != previous_encendido:
        # Se ha producido un cambio en el estado del sensor
        enviar_notificacion(current_encendido)

    # Lista para almacenar los valores de humedad
    valores_de_humedad = []
    if resHumedad.status_code == 200:
        data = resHumedad.json()  # datos en formato JSON

        # Itera a través de los objetos JSON y extrae los valores de humedad
        for objeto in data:
            valor_humedad = objeto.get('humedad')
            if valor_humedad is not None:
                valores_de_humedad.append(valor_humedad)
    else:
        print("Error al realizar la solicitud:", resHumedad.status_code)
        continue

    # Obtén el valor actual de la humedad
    current_humedad = str(valores_de_humedad[len(valores_de_humedad) - 1])
    previous_humedad = current_humedad

    if current_humedad is not None and umbral is not None and current_humedad == previous_humedad:
        print(f"current_humedad: {current_humedad}, umbral: {umbral}")
        if current_humedad <= str(umbral):
            print(f"Enviar notificación de humedad: {current_humedad}")
            enviar_notificacion_umbral(f"Humedad igual o menor al umbral: {current_humedad}%")

    # Actualiza el estado anterior con el estado actual
    previous_encendido = current_encendido

    indice = len(mensajes["result"])
    print("INDICE=" + str(indice))
    for i in range(len(mensajes["result"])):
        if "message" in mensajes["result"][i]:
            if "text" in mensajes["result"][i]["message"]:
                # Llamar a la funcion "leer_mensaje()"
                idchat, nombre, texto, id_update = leer_mensaje(mensajes["result"][i])

                # Si la ID del mensaje es mayor que el ultimo, se guarda la ID + 1
                if id_update > (ultima_id - 1):
                    ultima_id = id_update + 1

                # Generar una respuesta a partir de la informacion del mensaje
                if "Humedad" in texto:
                    if resHumedad.status_code == 200:
                        data = resHumedad.json()  # datos en formato JSON

                        # Lista para almacenar los valores de humedad
                        valores_de_humedad = []

                        # Itera a través de los objetos JSON y extrae los valores de humedad
                        for objeto in data:
                            valor_humedad = objeto.get('humedad')
                            if valor_humedad is not None:
                                valores_de_humedad.append(valor_humedad)

                        # La lista 'valores_de_humedad' contendrá los valores de humedad
                        # texto_respuesta = "Hola, " + nombre + "!"
                        texto_respuesta = \
                            ("El valor actual de la humedad es de " +
                             str(valores_de_humedad[len(valores_de_humedad) - 1])) + "%"

                    else:
                        print("Error al realizar la solicitud:", resHumedad.status_code)

                elif "Historial" in texto:
                    if resHumedad.status_code == 200:
                        data = resHumedad.json()  # datos en formato JSON

                        # Ordena los datos por fecha en orden descendente
                        data_sorted = sorted(data, key=lambda x: x['fecha'] + x['hora'], reverse=True)

                        # Tomar solo los últimos 50 elementos
                        data_ultimos_50 = data_sorted[:50]

                        texto_respuesta = ("Listado de datos de humedad: \n" +
                                           "  Fecha               Hora         Humedad\n")

                        # Inicializa las variables de fecha y humedad antes del bucle
                        previous_fecha = None
                        previous = None

                        # Itera a través de los objetos JSON y extrae los valores de humedad
                        for objeto in data_ultimos_50:
                            valor_humedad = objeto.get('humedad')
                            valor_de_fecha = objeto.get('fecha')
                            valor_de_fecha = valor_de_fecha[:10]
                            valor_de_hora = objeto.get('hora')

                            # Verifica si la humedad no es nula
                            if valor_humedad is not None:
                                # Verifica si la fecha y la humedad son iguales a las anteriores
                                if valor_de_fecha != previous_fecha or valor_humedad != previous:
                                    # Construye el texto de respuesta
                                    texto_respuesta += f"{valor_de_fecha}      {valor_de_hora}       {valor_humedad}% \n"

                                # Actualiza las variables de fecha y humedad para la próxima iteración
                                previous_fecha = valor_de_fecha
                                previous = valor_humedad

                elif "Umbral" in texto:
                    # Cambia el estado para indicar que estamos esperando el umbral
                    esperando_umbral = True
                    idchat_esperando_umbral = idchat  # Almacena el ID del chat actual
                    texto_respuesta = ("Si desea activar el Umbral, ingrese a continuación el porcentaje de humedad "
                                       "en el que debe enviar la notificación de humedad mínima: ")

                elif esperando_umbral and idchat == idchat_esperando_umbral:
                    try:
                        # Procesa el umbral enviado por el usuario
                        umbral = float(texto)
                        # Realiza la acción correspondiente con el umbral (puedes ajustar esto según tus necesidades)
                        print(f"Umbral configurado para el chat {idchat_esperando_umbral}: {umbral}%")
                        # Envia un mensaje de confirmación al usuario
                        enviar_mensaje(idchat_esperando_umbral, f"Umbral registrado exitosamente: {umbral}%")
                    except ValueError:
                        # Maneja el caso en el que el usuario no proporciona un número válido
                        enviar_mensaje(idchat_esperando_umbral,
                                       "Error al procesar el umbral. Por favor, ingrese un número válido.")

                    # Resetea el estado de espera del umbral
                    esperando_umbral = False
                    idchat_esperando_umbral = None

                    # Continúa con la siguiente iteración del bucle para evitar mostrar nuevamente el mensaje de umbral
                    continue

                elif "Apagar umbral" in texto:
                    umbral = None
                    texto_respuesta = "Umbral apagado"

                else:
                    texto_respuesta = "Has escrito: \"" + texto + ("\", consulta el listado de comandos para recibir la"
                                                                   " información que necesites.")

                # Enviar la respuesta
                enviar_mensaje(idchat, texto_respuesta)

        # Vaciar el diccionario
        mensajes_diccionario = []

    # Actualiza la última ID solo si hay mensajes para procesar
    if mensajes["result"]:
         ultima_id = mensajes["result"][-1]["update_id"] + 1
