# FrontEnd_Inscripciones

El prototipo mock `/admin` se habilita solo con `NEXT_PUBLIC_ADMIN_DEMO_ENABLED=true` al compilar (apagado por defecto, ver `.env.example`). Se fija en el build: para cambiarlo hay que volver a correr `npm run build`. Con el flag apagado, todas las rutas `/admin*` responden 404, también con cookie de sesión.
