# 🤖 Bot de WhatsApp IA para Kaldirev Bolivia

Este es un bot de WhatsApp automatizado con Inteligencia Artificial que utiliza la librería gratuita `whatsapp-web.js` y la API de Google Gemini (gratis) para procesar y confirmar pedidos de forma automática.

---

## 🛠️ Cómo Encender tu Bot de WhatsApp (Paso a Paso)

Sigue estos sencillos pasos en la terminal de tu computadora:

### 1. Entra a la carpeta del bot
Abre tu consola/terminal y navega a la carpeta del bot ejecutando:
```bash
cd whatsapp-bot
```

### 2. Instala las dependencias necesarias
Para instalar las librerías requeridas (WhatsApp Web JS y Gemini SDK), ejecuta:
```bash
npm install
```

### 3. Enciende el Bot
Ejecuta el comando para encender el bot:
```bash
npm start
```

### 4. Escanea el Código QR
1. En la consola de tu terminal aparecerá un **código QR de color negro y blanco**.
2. Abre la aplicación de **WhatsApp** en el celular que vas a usar (tu nuevo número vacío).
3. Ve a la esquina superior derecha y haz clic en los **tres puntos** (Android) o en **Configuración** (iPhone).
4. Selecciona **Dispositivos Vinculados** y luego **Vincular un Dispositivo**.
5. Escanea el código QR de la pantalla de tu terminal.

¡Y listo! La consola dirá `¡El chatbot de Kaldirev Bolivia está conectado y listo!`.

---

## 💡 Recomendación de Producción

Mientras la terminal esté abierta y tu computadora encendida, el bot responderá los mensajes de tus clientes las 24 horas del día. 

Si deseas que responda incluso si apagas tu computadora, puedes subir esta misma carpeta `whatsapp-bot` a un servidor en la nube gratuito como **Railway** o **Render**, lo cual mantendrá tu bot activo al 100% de forma permanente.
