// Importar a biblioteca MQTT.js
import mqtt from "mqtt";

// Configurações do broker MQTT
const mqttServer = 'mqtt://mqtt.eclipseprojects.io';
const temperatureTopic = '3C/temperatura';
const humidityTopic = '3C/umidade';

// Variáveis para armazenar os dados
let temperatura = null;
let umidade = null;

// Conectar ao broker MQTT
const client = mqtt.connect(mqttServer);

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');

  // Inscrever-se nos tópicos de temperatura e umidade
  client.subscribe([temperatureTopic, humidityTopic], (err) => {
    if (err) {
      console.error('Falha ao se inscrever nos tópicos:', err);
    } else {
      console.log('Inscrito nos tópicos:', temperatureTopic, 'e', humidityTopic);
    }
  });
});

// Quando uma mensagem é recebida
client.on('message', (topic, message) => {
  // Converter a mensagem para string
  const payload = message.toString();

  if (topic === temperatureTopic) {
    temperatura = payload;
    console.log(`Temperatura recebida: ${temperatura} C`);
  } else if (topic === humidityTopic) {
    umidade = payload;
    console.log(`Umidade recebida: ${umidade} %`);
  }

  // Verificar se as duas variáveis foram definidas
  if (temperatura !== null && umidade !== null) {
    console.log('Dados recebidos e armazenados. Desconectando...');
    client.end(); // Desconectar do broker MQTT
  }
});
