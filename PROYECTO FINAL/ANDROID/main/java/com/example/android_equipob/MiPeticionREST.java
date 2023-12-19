package com.example.android_equipob;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import java.nio.charset.StandardCharsets;

public class MiPeticionREST extends AsyncTask<String, String, String> {
    private TextView tvResponse;
    private EditText tvRespuesta, etUrl;
    private String mensaje;
    private String url; // Agregado


    public MiPeticionREST(TextView tvResponse, EditText tvRespuesta, EditText etUrl) {

        this.tvResponse = tvResponse;
        this.tvRespuesta = tvRespuesta;
        this.etUrl=etUrl;
    }
    public MiPeticionREST() {

        this.tvResponse = null;
        this.tvRespuesta = null;

    }

    @Override
    protected void onPreExecute() {
    }

    @Override
    protected String doInBackground(String... info) {
        String res = "";

        try
        {
            String baseURL = etUrl.getText().toString();
            URL url;

            if (info[0].equals("GET")) {
                //URL url = new URL("https://d5c0bea12cb400e2a03839343a2ebbed.serveo.net/hve");
                //Usar la URL ingresada desde el EditText
                //String urlString = etUrl.getText().toString();
                //URL url = new URL(urlString);

                // Concatena "hve" para GET
                url = new URL(baseURL + "/hve");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setUseCaches(false);
                conn.setAllowUserInteraction(false);
                conn.setConnectTimeout(1000);
                conn.setReadTimeout(1000);
                conn.connect();

                int status = conn.getResponseCode();

                if (status == 200) {
                    InputStreamReader reader = new InputStreamReader(conn.getInputStream());
                    BufferedReader br = new BufferedReader(reader);

                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line).append("\n");
                    }
                    br.close();
                    res = sb.toString();

                } else {
                    // Si la conexión no es exitosa
                    Log.e("ENVIOREST", "Error en la conexión. Código de estado: " + status);
                }
                conn.disconnect();
            }

                if (info[0].equals("UPDATE")) {
                    //URL url = new URL("https://d5c0bea12cb400e2a03839343a2ebbed.serveo.net/ce");
                    //Usar la URL ingresada desde el EditText
                    //String urlString = etUrl.getText().toString();
                    //URL url = new URL(urlString);

                    // Concatena "ce" para POST
                    url = new URL(baseURL + "/ce");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setDoOutput(true);
                    conn.setUseCaches(false);
                    conn.setAllowUserInteraction(false);
                    conn.setConnectTimeout(1000);
                    conn.setReadTimeout(1000);
                    conn.setRequestMethod("PUT");
                    conn.setRequestProperty("Content-Type", "application/json");

                    // Obtener el nuevo estado
                    String nuevoEstado = tvRespuesta.getText().toString();
                    String input = "{\"nuevoEstado\": \"" + nuevoEstado + "\"}";

                    OutputStream os = conn.getOutputStream();
                    os.write(input.getBytes());
                    os.flush();

                    if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                        res = "Nuevo estado enviado con éxito";
                    } else if (conn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND) {
                        res = "Error: Tabla Estado no encontrada (404)";
                        Log.e("UPDATE_ERROR", "Detalles del error: " + readResponse(conn));
                    } else {
                        res = "Error al actualizar el nuevo estado: " + conn.getResponseCode();
                        Log.e("UPDATE_ERROR", "Detalles del error: " + readResponse(conn));
                    }
                    conn.disconnect();
                }

        }
        catch (MalformedURLException e) {
            Log.e("ENVIOREST", "[MalformedURLException]=>" + e.getMessage());
            e.printStackTrace();

        } catch (IOException e) {
            Log.e("ENVIOREST", "[IOException]=>" + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }

    @Override
    protected void onProgressUpdate(String... progress) {
    }

    private String readResponse(HttpURLConnection conn) throws IOException {
        InputStreamReader reader = new InputStreamReader(conn.getErrorStream());
        BufferedReader br = new BufferedReader(reader);

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }
        br.close();
        return sb.toString();
    }


    @Override
    protected void onPostExecute(String result) {
        if (result != null && !result.isEmpty()) {
            // Modifica la lógica para mostrar el resultado del GET
            if (tvResponse != null) {
                try {
                    JSONArray jsonArray = new JSONArray(result);

                    if (jsonArray.length() > 0) {
                        JSONObject jsonObject = jsonArray.getJSONObject(0);
                        String encendido = jsonObject.optString("encendido", "");

                        if (encendido.equalsIgnoreCase("si")) {
                            tvResponse.setText("El sensor está encendido");
                        } else if (encendido.equalsIgnoreCase("no")) {
                            tvResponse.setText("El sensor está apagado");
                        } else {
                            tvResponse.setText("Estado desconocido");
                        }
                    }
                } catch (JSONException e) {
                    // Si no se puede crear un JSONArray, asume que la respuesta es un simple string
                    tvResponse.setText(result);
                }
            }
        }else {
            // En caso de error o conexión fallida
            if (tvResponse != null) {
                tvResponse.setText("Error al obtener datos del servidor");
            }
        }
    }
}


