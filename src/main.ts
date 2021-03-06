import { HttpStatus, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './api/common/filters/http-exception.filter';
import { appConfiguration } from './api/configuration/app.configuration'
import { AppConfig } from './api/types/index';
const compression = require('compression')
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const appConfig = app.get<AppConfig>(appConfiguration.KEY);

  const logger = new Logger('NestApplication');
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Auth-Nestjs-Mongodb')
    .setDescription('API Documentation for Auth')
    .setVersion('1.0.0')
    .addServer(`${appConfig.domain}/api/`, 'Development API')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, swaggerDoc, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  logger.debug(`Swagger Docs enabled: ${appConfig.domain}/docs`);


  app.use('/robots.txt', (_, res) => {
    res.send('User-Agent: *\n' + 'Disallow: /');
  });
  app.use('/favicon.ico', (_, res) => {
    res.sendStatus(HttpStatus.NO_CONTENT).end();
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(appConfig.port, () => {
    logger.log('Listening at ' + appConfig.domain + '/');
  });
}

bootstrap();
