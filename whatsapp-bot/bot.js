const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
Eres la Inteligencia Actoral/Asistente de Ventas oficial de Kaldirev Bolivia, encargada de recibir y confirmar pedidos de combos alimenticios saludables de forma autónoma.
Tu tono de voz debe ser muy amable, educado y cercano, usando español de Bolivia (puedes usar palabras de cortesía y modismos locales de manera sutil y respetuosa).

NUESTROS PRODUCTOS Y COMBOS DISPONIBLES:
1. Kit Energía Diaria: Bs. 120 (Original Bs. 150). Incluye: Colágeno Hidrolizado (250g), Maca Negra en Polvo (150g) y Harina de Avena (500g).
2. Kit Bienestar & Huesos: Bs. 190 (Original Bs. 250). Incluye: Calcio con Magnesio, Cartílago de Tiburón y Harina de Linaza.
3. Kit Antojo Saludable: Bs. 90 (Original Bs. 120). Incluye: Mix de Frutos Secos Premium (250g), Granola Artesanal con Miel (400g) y Harina de Coco (250g).

Misión del Bot:
- Si un cliente te escribe pidiendo información o saludando, preséntate alegremente, cuéntale sobre los combos y pregúntale cuál le gustaría ordenar.
- Si te llega un mensaje de pedido pre-llenado desde la página web (que contiene los productos y el precio total), inicia el proceso de toma de datos de envío.
- Debes obtener amablemente los siguientes datos de entrega obligatorios para agendar el envío:
  * Nombre Completo.
  * Dirección de Entrega exacta (calle, número, zona o referencia de la casa).
  * Ciudad de Entrega (operamos en Santa Cruz, La Paz, Cochabamba y hacemos envíos nacionales interdepartamentales a otras ciudades).
  * Ubicación GPS (Google Maps): Explícales que pueden adjuntar/compartir su ubicación en este mismo chat usando la opción nativa de WhatsApp ("Compartir ubicación") para que la moto llegue con exactitud.
  * Método de pago preferido (Efectivo contraentrega al recibir el producto, transferencia bancaria previa o QR de banco).

REGLAS DE RESPUESTA:
1. Mantén respuestas concisas, cortas y amigables (máximo 2 a 3 párrafos cortos). La gente no lee textos gigantes en WhatsApp.
2. Si falta algún dato, pídelo educadamente.
3. Si el cliente tiene dudas sobre los beneficios, ingredientes, dosificación o cómo tomar los productos de cada combo, explícaselos con base en la información del combo.
4. Una vez que tengas TODOS los datos confirmados, resume los detalles de la entrega y despídete con un mensaje final como:
"¡Perfecto! He registrado todos tus datos de envío con éxito. Tu pedido ha sido confirmado. Un operador humano de Kaldirev Bolivia se comunicará contigo en breve para coordinar el horario exacto de la entrega. ¡Muchas gracias por elegirnos!"
5. Una vez confirmado el pedido, si el cliente sigue escribiendo agradecimientos, responde cordialmente y finaliza el flujo de venta.
`;

const MODELS_TO_TRY = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp',
  'gemini-pro'
];

let cachedModel = null;

async function getAIModel() {
  if (cachedModel) return cachedModel;

  console.log("--- Detectando modelo de Gemini activo ---");
  for (const modelName of MODELS_TO_TRY) {
    console.log(`Probando modelo: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION });
      // Test the model with a tiny generateContent check
      await model.generateContent("Hola");
      console.log(`🟢 ¡Éxito! Usando modelo: ${modelName}`);
      cachedModel = model;
      return cachedModel;
    } catch (err) {
      console.log(`❌ No disponible: ${modelName}. Motivo: ${err.message || err}`);
    }
  }
  throw new Error("No se pudo conectar con ningún modelo de Gemini disponible. Revisa tu clave de API.");
}

// Session history in memory (Key: chatId, Value: Array of messages for context)
const sessions = {};

// Helper to keep history within last 12 messages to avoid large prompts
const addToSession = (chatId, role, text) => {
  if (!sessions[chatId]) {
    sessions[chatId] = [];
  }
  sessions[chatId].push({ role, parts: [{ text }] });
  if (sessions[chatId].length > 12) {
    sessions[chatId].shift(); // Remove oldest message
  }
};

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session'
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Event: QR Code generation
client.on('qr', (qr) => {
  console.clear();
  qrcode.generate(qr, { small: true });
  console.log('\n================================================================');
  console.log('📍 ESCANEA ESTE CÓDIGO QR CON TU WHATSAPP NUEVO/VACÍO');
  console.log('Ve a WhatsApp -> Menú (tres puntos o configuración) -> Dispositivos Vinculados -> Vincular Dispositivo.');
  console.log('================================================================\n');
});

// Event: Connection Ready
client.on('ready', () => {
  console.log('\n================================================================');
  console.log('🎉 ¡El chatbot de Kaldirev Bolivia está conectado y listo!');
  console.log('Esperando mensajes entrantes en el número vinculado...');
  console.log('================================================================\n');
});

// Event: Incoming Message
client.on('message', async (msg) => {
  // Ignore group chats and status updates
  if (msg.from.includes('@g.us') || msg.isStatus) return;

  const chatId = msg.from;
  const userMessage = msg.body.trim();



  try {
    // Add user message to history
    addToSession(chatId, 'user', userMessage);

    // Get the dynamically loaded and verified AI model
    const model = await getAIModel();

    // Call Gemini API
    const chat = model.startChat({
      history: sessions[chatId].slice(0, -1) // pass history excluding the last message we just added
    });

    console.log(`[Mensaje Recibido de ${chatId}]: ${userMessage}`);

    // Generate response from model
    const result = await chat.sendMessage(userMessage);
    const replyText = result.response.text();

    // Add bot response to history
    addToSession(chatId, 'model', replyText);

    // Send response back
    await client.sendMessage(chatId, replyText);
    console.log(`[Bot responde a ${chatId}]: ${replyText}\n`);

  } catch (err) {
    console.error('Error al procesar el mensaje con Gemini:', err);
  }
});

// Start Client
client.initialize();
