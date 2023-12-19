import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import seaborn as sns
import json

with open('dicccionario.json', 'r') as archivo_json:
    data_list = json.load(archivo_json)

##########################################################################################
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

############################################################################################

df = pd.DataFrame(columns=['id', 'humedad_suelo', 'fecha', 'hora', 'estacion', 'year'])

try:
    for data in data_list:
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        hora = datetime.strptime(data['hora'], '%H:%M:%S').time()

        estacion = obtener_estacion(fecha)

        # Crear un nuevo DataFrame con el nuevo conjunto de datos
        df_nuevo = pd.DataFrame({
            'id': [data['id']],
            'humedad_suelo': [data['humedad']],
            'fecha': [fecha],
            'hora': [hora],
            'estacion': [estacion]
        })

        df = pd.concat([df, df_nuevo], ignore_index=True)

    print('Datos almacenados en el DataFrame con éxito')
except Exception as e:
    print(f'Error al procesar la respuesta: {e}')

#print(df)


df['estacion'] = pd.Categorical(df['estacion'], categories=['Invierno', 'Primavera', 'Verano', 'Otoño'], ordered=True)

# Convertir la columna 'fecha' a tipo datetime si no lo es ya
df['fecha'] = pd.to_datetime(df['fecha'])

# Agregar una columna para el nombre del día de la semana8
df['nombre_dia'] = df['fecha'].dt.strftime('%A')

# Agregar una columna para el número del día del mes
df['numero_dia'] = df['fecha'].dt.day

meses_ordenados = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
df['inicial_mes'] = pd.Categorical(df['fecha'].dt.strftime('%b'), categories=meses_ordenados, ordered=True)

df['year'] = df['fecha'].dt.year

print(df)

estaciones_unicas = df['estacion'].unique()

meses_ordenados = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

colores_estaciones = sns.color_palette("husl", n_colors=len(estaciones_unicas))

valores_referencia = {'Invierno': 40, 'Primavera': 60, 'Verano': 70, 'Otoño': 50}

# Iterar sobre cada estación y crear un gráfico con dos subgráficos (uno para el año actual y otro para el año anterior)
for i, estacion in enumerate(estaciones_unicas):
    # Filtrar datos para la estación actual
    data_estacion = df[(df['estacion'] == estacion)]

    # Filtrar datos para el año actual y la estación actual
    data_actual_estacion = data_estacion[(data_estacion['year'] == 2023)].copy()

    # Filtrar datos para el año anterior y la estación actual
    data_anterior_estacion = data_estacion[(data_estacion['year'] == 2022)].copy()

    # Convertir el mes y el día a strings y concatenarlos para ordenar correctamente
    data_actual_estacion['mes_dia'] = data_actual_estacion['inicial_mes'].astype(str) + ' ' + data_actual_estacion['numero_dia'].astype(str)
    data_anterior_estacion['mes_dia'] = data_anterior_estacion['inicial_mes'].astype(str) + ' ' + data_anterior_estacion['numero_dia'].astype(str)

    # Ordenar los datos por mes_dia
    data_actual_estacion = data_actual_estacion.sort_values(by='mes_dia', key=lambda x: pd.to_datetime(x, format='%b %d'))
    data_anterior_estacion = data_anterior_estacion.sort_values(by='mes_dia', key=lambda x: pd.to_datetime(x, format='%b %d'))

    # Crear una figura con dos subgráficos (uno para el año actual y otro para el año anterior)
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))

    # Subgráfico para el año actual
    axes[0].bar(data_actual_estacion['mes_dia'],
                data_actual_estacion['humedad_suelo'], label='Actual', color=colores_estaciones[i], alpha=0.7)
    axes[0].axhline(y=valores_referencia[estacion], linestyle='--', color='gray', label='Referencia')
    axes[0].set_xlabel('Día del Mes')
    axes[0].set_ylabel('Humedad')
    axes[0].set_title(f'Estación: {estacion} - Año Actual')
    axes[0].tick_params(rotation=45, axis='x', labelrotation=45)
    axes[0].legend()

    # Subgráfico para el año anterior
    axes[1].bar(data_anterior_estacion['mes_dia'],
                data_anterior_estacion['humedad_suelo'], label='Anterior', color=colores_estaciones[i], alpha=0.7)
    axes[1].axhline(y=valores_referencia[estacion], linestyle='--', color='gray', label='Referencia')
    axes[1].set_xlabel('Día del Mes')
    axes[1].set_ylabel('Humedad')
    axes[1].set_title(f'Estación: {estacion} - Año Anterior')
    axes[1].tick_params(rotation=45, axis='x', labelrotation=45)
    axes[1].legend()

    # Ajustar el diseño y mostrar la figura
    plt.tight_layout()
    plt.show()


# media_por_estacion = df.groupby('estacion')['humedad_suelo'].mean()
#
# desviacion_por_estacion = df.groupby('estacion')['humedad_suelo'].std()
#
# rango_por_estacion = df.groupby('estacion')['humedad_suelo'].max() - df.groupby('estacion')['humedad_suelo'].min()
#
# cuartiles_por_estacion = df.groupby('estacion')['humedad_suelo'].quantile([0.25, 0.75]).unstack()
#
# minimo_por_estacion = df.groupby('estacion')['humedad_suelo'].min()
#
# maximo_por_estacion = df.groupby('estacion')['humedad_suelo'].max()
#
# # Media de Humedad por Estación (Gráfico de Barras)
# plt.figure(figsize=(10, 6))
# sns.barplot(x=media_por_estacion.index, y=media_por_estacion.values, palette="viridis")
# plt.title("Media de Humedad por Estación")
# plt.xlabel("Estación")
# plt.ylabel("Media de Humedad")
# plt.show()
#
# # Variabilidad (Desviación Estándar) de la Humedad por Estación (Gráfico de Barras)
# plt.figure(figsize=(10, 6))
# sns.barplot(x=desviacion_por_estacion.index, y=desviacion_por_estacion.values, palette="plasma")
# plt.title("Desviación Estándar de Humedad por Estación")
# plt.xlabel("Estación")
# plt.ylabel("Desviación Estándar de Humedad")
# plt.show()
#
# # Rango de Humedad por Estación (Gráfico de Barras)
# plt.figure(figsize=(10, 6))
# sns.barplot(x=rango_por_estacion.index, y=rango_por_estacion.values, hue=rango_por_estacion.index, palette="magma", dodge=False)
# plt.title("Rango de Humedad por Estación")
# plt.xlabel("Estación")
# plt.ylabel("Rango de Humedad")
# plt.legend(title='Estación', loc='upper left')
# plt.show()
#
# # Cuartiles (Q1, Q3) de Humedad por Estación (Gráfico de Caja)
# plt.figure(figsize=(10, 6))
# sns.boxplot(x='estacion', y='humedad_suelo', data=df, palette="mako")
# plt.title("Cuartiles de Humedad por Estación")
# plt.xlabel("Estación")
# plt.ylabel("Humedad del Suelo")
# plt.show()
#
# # Mínimo y Máximo de Humedad por Estación (Gráfico de Barras)
# fig, axes = plt.subplots(2, 1, figsize=(10, 8), sharex=True)
# sns.barplot(x=minimo_por_estacion.index, y=minimo_por_estacion.values, ax=axes[0], palette="skyblue")
# axes[0].set_title("Mínimo de Humedad por Estación")
# axes[0].set_xlabel("Estación")
# axes[0].set_ylabel("Mínimo de Humedad")
#
# sns.barplot(x=maximo_por_estacion.index, y=maximo_por_estacion.values, ax=axes[1], palette="salmon")
# axes[1].set_title("Máximo de Humedad por Estación")
# axes[1].set_xlabel("Estación")
# axes[1].set_ylabel("Máximo de Humedad")
#
# plt.tight_layout()
# plt.show()
