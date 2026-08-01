import random
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# URL de tu formulario de Florametrics
URL_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdRVb6fHfZFJdiE18FOQrqU4pJchOqAeaR_LqRioAJ-olyk9g/viewform"

# Configurar el navegador
options = webdriver.ChromeOptions()
# options.add_argument("--headless") # Descomenta esta línea si quieres que corra en segundo plano sin abrir ventanas
driver = webdriver.Chrome(options=options)

total_encuestas = 42  # Cambia este número según las que te falten para llegar a las 68

try:
  for i in range(total_encuestas):
    print(f"--- Iniciando encuesta {i + 1} de {total_encuestas} ---")
    driver.get(URL_FORM)

    # Esperar a que carguen los grupos de opciones
    wait = WebDriverWait(driver, 10)
    wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, 'div[role="radiogroup"]')
        )
    )

    grupos_radios = driver.find_elements(By.CSS_SELECTOR, 'div[role="radiogroup"]')

    # Recorrer cada pregunta (grupo de radio buttons) y seleccionar una respuesta lógica
    for index, grupo in enumerate(grupos_radios):
      opciones = grupo.find_elements(By.CSS_SELECTOR, 'div[role="radio"]')
      if not opciones:
        continue

      seleccion_idx = 0  # Por defecto la primera opción

      # Lógica de respuestas coherentes para el mercado de plantas
      if index == 0:
        seleccion_idx = 0  # 1. Tienes plantas? -> Sí
      elif index == 1:
        seleccion_idx = (
            random.choice([0, 1]) if len(opciones) > 1 else 0
        )  # 2. Dificultad: Falta de conocimiento o plagas
      elif index == 2:
        seleccion_idx = (
            random.choice([1, 2]) if len(opciones) > 2 else 0
        )  # 3. Frecuencia de compra: Mensual o trimestral
      elif index in [3, 7, 9]:
        seleccion_idx = 0  # 4, 8, 10. Escalas: Extremadamente útil / Totalmente de acuerdo / Muy satisfecho
      elif index == 4:
        seleccion_idx = (
            1 if len(opciones) > 1 else 0
        )  # 5. Uso gratis: De 1 a 3 veces al mes
      elif index == 5:
        seleccion_idx = (
            random.choice([0, 1]) if len(opciones) > 1 else 0
        )  # 6. Rango de precios: Nada o 10-20 Bs
      elif index == 6:
        seleccion_idx = 0  # 7. Ha usado IA antes: Sí
      elif index == 8:
        seleccion_idx = (
            random.choice([0, 2]) if len(opciones) > 2 else 0
        )  # 9. Cómo identifica: Internet o vivero

      # Asegurar que el índice existe para evitar errores y hacer clic
      if seleccion_idx < len(opciones):
        driver.execute_script("arguments[0].click();", opciones[seleccion_idx])
      else:
        driver.execute_script("arguments[0].click();", opciones[0])

      time.sleep(0.2)

    # Buscar y hacer clic en el botón de Enviar
    try:
      botones = driver.find_elements(By.CSS_SELECTOR, "span.l4V7wb")
      boton_enviar = None
      for b in botones:
        if (
            "enviar" in b.text.lower()
            or "submit" in b.text.lower()
            or "Enviar" in b.text
        ):
          boton_enviar = b
          break

      if boton_enviar:
        driver.execute_script("arguments[0].click();", boton_enviar)
        print("-> Encuesta enviada correctamente.")
      else:
        print(
            "-> No se encontró el botón de enviar visualmente, intentando por"
            " XPath..."
        )
        enviar_alt = driver.find_element(
            By.XPATH, '//span[contains(text(), "Enviar")]'
        )
        driver.execute_script("arguments[0].click();", enviar_alt)
    except Exception as e:
      print(f"-> Error al hacer clic en enviar: {e}")

    # Esperar a que se procese la pantalla de confirmación de Google Forms
    time.sleep(2.5)

    # Buscar el enlace "Enviar otra respuesta" para la siguiente iteración
    try:
      enlace_otra = wait.until(
          EC.element_to_be_clickable(
              (
                  By.XPATH,
                  '//a[contains(text(), "Enviar otra respuesta") or'
                  ' contains(@href, "viewform")]',
              )
          )
      )
      driver.execute_script("arguments[0].click();", enlace_otra)
      print("-> Preparando siguiente formulario...")
    except:
      print("-> No se pudo enlazar automáticamente, recargando URL base...")
      # Si falla el enlace directo, el ciclo recargará la URL por defecto en la siguiente iteración

    time.sleep(1.5)

finally:
  print("¡Proceso de automatización finalizado!")
  driver.quit()