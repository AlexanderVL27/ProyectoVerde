import requests
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns

# PONER AQUÍ EL URL
url = "https://4ebccf09cae4653289832c469397aa9e.serveo.net/"
#url = "http://591d-187-190-180-240.ngrok-free.app"
print('Conexion exitosa')

response = requests.get("https://4ebccf09cae4653289832c469397aa9e.serveo.net/hg")
print('Respuesta del servidor:', response.text)

def obtener_estacion(fecha):
    # Determinar el mes de la fecha
    mes = fecha.month

    # Asignar la estación según el mes
    if 3 <= mes <= 5:
        return "Primavera"
    elif 6 <= mes <= 8:
        return "Verano"
    elif 9 <= mes <= 11:
        return "Otoño"
    else:
        return "Invierno"

# Ejemplo de uso
fecha_actual = datetime.now()
estacion_actual = obtener_estacion(fecha_actual)


# Crear un DataFrame vacío que nos servirá para almacenar los valores que regresa la petición GET
# La columna "estación" es un dato que NO se obtiene del JSON que retorna el servidor, es una columna
# que agregamos para categorizar cada uno de los datos y poder hacer las gráficas.

df = pd.DataFrame(columns=['id', 'humedad', 'fecha', 'hora', 'estacion'])

# Aquí es donde se añaden los datos obtenidos del servidor (archivo JSON) al DataFrame, para posteriormente realizar las gráficas
try:
    data_list = response.json()  #Se especifica que se está recibiendo un json de la variable response (variable que realiza la petición GET)

    for data in data_list:
        # Convierte la fecha y hora de cadena a objetos datetime
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        hora = datetime.strptime(data['hora'], '%H:%M:%S').time()

        # Obtener la estación utilizando la función obtener_estacion
        estacion = obtener_estacion(fecha)

        # Crear un nuevo DataFrame con el nuevo conjunto de datos
        df_nuevo = pd.DataFrame({
            'id': [data['id']],
            'humedad': [data['humedad']],
            'fecha': [fecha],
            'hora': [hora],
            'estacion': [estacion]
        })

        # Concatenar el nuevo DataFrame(que estaba vacío) con el DataFrame que se acaba de llenar con los datos recibidos por la petición geten 
        df = pd.concat([df, df_nuevo], ignore_index=True)

    print('Datos almacenados en el DataFrame con éxito')
except Exception as e:
    print(f'Error al procesar la respuesta: {e}')

#Configuraciones para imprimir todo el dataframe

#pd.set_option('display.max_rows', None)
#pd.set_option('display.max_columns', None)
#pd.set_option('display.width', None)

print(df)


df['estacion'] = pd.Categorical(df['estacion'], categories=['Invierno', 'Primavera', 'Verano', 'Otoño'], ordered=True)

# Convertir la columna 'fecha' a tipo datetime si no lo es ya
df['fecha'] = pd.to_datetime(df['fecha'])

# Agregar una columna para el nombre del día de la semana
df['nombre_dia'] = df['fecha'].dt.strftime('%A')

# Agregar una columna para el número del día del mes
df['numero_dia'] = df['fecha'].dt.day

# Agregar una columna para la inicial del nombre del mes
df['inicial_mes'] = df['fecha'].dt.strftime('%b')

# Definir la columna 'inicial_mes' como categórica con un orden de sucesión
meses_ordenados = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
df['inicial_mes'] = pd.Categorical(df['inicial_mes'], categories=meses_ordenados, ordered=True)

# Ordenar el DataFrame por la fecha
df = df.sort_values(by='fecha')

# Colores para cada una de las distintas estaciones del año
colores_estaciones = sns.color_palette("husl", n_colors=len(df['estacion'].unique()))

# Crea gráficos separados para cada estación
for estacion, color in zip(df['estacion'].unique(), colores_estaciones):
    data_estacion = df[df['estacion'] == estacion]

    # Convertir la columna 'inicial_mes' a cadena
    data_estacion = data_estacion.copy()
    data_estacion['inicial_mes'] = data_estacion['inicial_mes'].astype(str)

    # Gráfica para la variación de la humedad
    plt.figure(figsize=(8, 6))
    plt.bar(data_estacion['inicial_mes'] + ' ' + data_estacion['numero_dia'].astype(str),
            data_estacion['humedad'], color=color)

    # Etiquetas y título de la gráfica
    plt.xlabel('Mes y Número del Día')
    plt.ylabel('Humedad')
    plt.title(f'Estación: {estacion}')

    # Mostrar el gráfico
    plt.show()

print(f"La estación actual es: {estacion_actual}")




