#include "DHT.h"

#define DHTPIN 12
#define DHTTYPE DHT11

float humedad, temperatura, indice;
int numLectura = 0;
int intSwitch = 0;

DHT dht(DHTPIN, DHTTYPE);
#include "BluetoothSerial.h"

//#define USE_PIN // Uncomment this to use PIN during pairing. The pin is specified on the line below
const char *pin = "1234";  // Change this to more secure PIN.

String device_name = "ESP32-BT-Slave";
byte receivedByte;
char receivedChar;
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.
#endif

BluetoothSerial SerialBT;

#include <WiFi.h>
#include <WiFiMulti.h>
#define USE_SERIAL Serial

WiFiMulti wifiMulti;

//Aqui ponen su red wifi
const char* ssid = "Rosher";
const char* password = "xr3ARf4Va2";
const char* host = "8d1d952a79382d38fb2f4e6f675aa7f9.serveo.net";
const int httpPort = 80; 

void setup() {  

  //Bluetooth
  Serial.begin(115200);
  //Serial1.begin(9600);

  SerialBT.begin(device_name);  //Bluetooth device name
  Serial.printf("The device with name \"%s\" is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str());
//Serial.printf("The device with name \"%s\" and MAC address %s is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str(), SerialBT.getMacString()); // Use this after the MAC method is implemented
#ifdef USE_PIN
  SerialBT.setPin(pin);
  Serial.println("Using PIN");
#endif
  
  //WIFI
  USE_SERIAL.begin(115200);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }
  

  wifiMulti.addAP(ssid, password);
  dht.begin();

}

void loop() {
  if (Serial.available()) {
    SerialBT.write('1');
  }
  if (SerialBT.available()) {
    byte receivedByte = SerialBT.read();     // Leer un byte
    char receivedChar = char(receivedByte);  // Convertir el byte a un carácter
    if (receivedChar == '0') {
        Serial.println("Bluetooth conectado");
    }
    if (receivedChar == 'y') {
      if(intSwitch!=1){
        intSwitch = 1;
        Serial.println("Encendiendo sensor");
        digitalWrite(DHTPIN,HIGH);
        Serial.println("Sensor encendido");
      }else{
        Serial.println("El sensor ya se encuentra encendido");
      }
      
    }
    if (receivedChar == 'n'){
      if(intSwitch!=0){
        intSwitch = 0;
        Serial.println("Apagando sensor");
        digitalWrite(DHTPIN,LOW);
        Serial.println("Sensor apagado");
      }else{
        Serial.println("El sensor ya se encuentra apagado");
      }
      
    }
  }
  if(intSwitch!=0){
  lectura();

  
  if ((wifiMulti.run() == WL_CONNECTED)) {
    Serial.print("Conectando a ");
    Serial.println(host);

    WiFiClient client;

    
    if (!client.connected()) {
      // Si no estamos conectados, intentamos reconectar
      if (client.connect(host, httpPort)) {
        Serial.println("Conexión establecida");
      } else {
        Serial.println("Error de conexión");
        delay(5000);
        return; // Intentar nuevamente en 5 segundos
      }
    }

    // Si llegamos aquí, tenemos una conexión activa
    // Puedes enviar y recibir datos aquí

    // Para verificar el estado de la conexión en el bucle, puedes usar:
    if (!client.connected()) {
      Serial.println("La conexión se ha perdido");
      // Puedes realizar acciones adicionales aquí, como intentar reconectar
      // o manejar la pérdida de conexión de la manera que desees.
    }

    // Objeto JSON a enviar en el cuerpo del POST
    String json = "{\"humedad\": "  +String(humedad) +"}";  // Cambia el valor según sea necesario

    // Construye la solicitud POST
    String postRequest = "POST /hp HTTP/1.1\r\n";
    postRequest += "Host: " + String(host) + "\r\n";
    postRequest += "Content-Type: application/json\r\n";
    postRequest += "Content-Length: " + String(json.length()) + "\r\n";
    postRequest += "\r\n";
    postRequest += json;

    Serial.println("Enviando solicitud POST:");
    Serial.println(postRequest);

    if (client.connect(host, httpPort)) {
      Serial.println("Conexión establecida");
      client.print(postRequest);
      delay(500);  // Espera breve para asegurar que se envíen todos los datos
      client.stop();
    } else {
      Serial.println("Error de conexión");
    }

    Serial.println("Solicitud completada");


  }

  //Se espera 5 esegundos para mandar otro dato
  delay(5000);
  }

}

void lectura(){
  
  humedad=dht.readHumidity();
  //temperatura=dht.readTemperature();

  if(isnan(humedad)||isnan(temperatura)){
    Serial.println("Error de lectua o Sensor apagado");
    return;
  }

  //Serial.print(".");
  //indice=dht.computeHeatIndex(temperatura,humedad,false);
  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.print("% \n");
  
  /*Serial.print("% Temperatura: ");
  Serial.print(temperatura);
  Serial.print("°C \n");
  */
  
  
}
