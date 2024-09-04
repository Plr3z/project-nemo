import mqtt from "mqtt";

const listarNome = async (req, res) => {
    let obj = {
        umi: null,
        temp: null
    };

    // Configurações do broker MQTT
    const mqttServer = 'mqtt://mqtt.eclipseprojects.io';
    const temperatureTopic = '3C/temperatura';
    const humidityTopic = '3C/umidade';

    // Conectar ao broker MQTT
    const client = mqtt.connect(mqttServer);

    // Criar uma promessa para aguardar as mensagens MQTT
    const mqttPromise = new Promise((resolve, reject) => {
        client.on('connect', () => {
            console.log('Conectado ao broker MQTT');

            // Inscrever-se nos tópicos de temperatura e umidade
            client.subscribe([temperatureTopic, humidityTopic], (err) => {
                if (err) {
                    console.error('Falha ao se inscrever nos tópicos:', err);
                    reject(err);
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
                obj.temp = payload;
                console.log(`Temperatura recebida: ${obj.temp} C`);
            } else if (topic === humidityTopic) {
                obj.umi = payload;
                console.log(`Umidade recebida: ${obj.umi} %`);
            }

            // Verificar se as duas variáveis foram definidas
            if (obj.temp !== null && obj.umi !== null) {
                console.log('Dados recebidos e armazenados. Desconectando...');
                client.end(); // Desconectar do broker MQTT
                resolve(obj); // Resolver a promessa com o objeto
            }
        });

        client.on('error', (err) => {
            console.error('Erro de conexão:', err);
            reject(err);
        });
    });

    try {
        const result = await mqttPromise; // Aguardar até que as mensagens sejam recebidas
        console.log('Objeto final:', result);
        res.json(result); // Enviar o objeto na resposta HTTP
    } catch (error) {
        res.status(500).json({ error: 'Falha ao receber os dados do MQTT' });
    }
};

export default { listarNome };
