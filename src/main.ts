import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- AGREGA ESTAS 3 LÍNEAS ---
  console.log("============== DEBUG VARIABLES DE ENTORNO ==============");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("========================================================");
  // -----------------------------

  // ACTIVAR EL TUBO DE VALIDACIÓN (PIPE)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Si alguien envía un dato extra que no está en el DTO, lo borra.
      forbidNonWhitelisted: true, // (Opcional) Si envían basura, lanza error.
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
