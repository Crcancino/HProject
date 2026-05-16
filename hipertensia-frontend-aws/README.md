# HipertensIA frontend + AWS IaC

Landing page profesional para **HipertensIA**, con diseño urbano inspirado en Valparaíso, rap/freestyle, comparación de audio **sin IA vs con IA**, reseñas con la segunda foto enviada y despliegue AWS usando IaC con **AWS CDK + S3 + CloudFront**.

## Qué incluye

- Frontend React + Vite + TypeScript.
- UI responsive de una landing completa.
- Reproductores con waveform para:
  - `Audio original (sin IA)`
  - `Versión mejorada con IA`
  - 2 audios adicionales como demos/material.
- Fotos optimizadas en `frontend/public/assets`.
- Audios convertidos a MP3 y conservados en OGG en `frontend/public/audio`.
- Infraestructura como código en `infra/`:
  - S3 privado.
  - CloudFront con HTTPS.
  - Deploy automático del `frontend/dist` al bucket.
  - Invalidation automática de CloudFront.
  - Dominio custom opcional para `crcancinosandbox.click`.

## Estructura

```txt
hipertensia-frontend-aws/
  frontend/
    src/
      App.tsx
      styles.css
      components/AudioPlayer.tsx
      data/tracks.ts
    public/
      audio/
      assets/
  infra/
    bin/app.ts
    lib/hipertensia-web-stack.ts
  package.json
```

## Requisitos

- Node.js 20 o superior.
- AWS CLI configurado con credenciales válidas.
- AWS CDK instalado por npm dentro del proyecto.
- Si usarás el dominio raíz `crcancinosandbox.click` con HTTPS, lo más limpio es tener la zona DNS en Route 53.

## Instalación local

```bash
npm install
npm run dev
```

Luego abre la URL local que entregue Vite.

## Build

```bash
npm run build
```

El build queda en:

```txt
frontend/dist
```

## Despliegue rápido sin dominio custom

Esto crea S3 + CloudFront y te entrega una URL tipo `https://xxxx.cloudfront.net`:

```bash
cd infra
npx cdk bootstrap aws://TU_ACCOUNT_ID/us-east-1
cd ..
npm run deploy
```

## Despliegue con `crcancinosandbox.click` usando Route 53

Primero asegúrate de que la hosted zone existe en Route 53 para:

```txt
crcancinosandbox.click
```

Luego:

```bash
cd infra
npx cdk bootstrap aws://TU_ACCOUNT_ID/us-east-1
cd ..
npm run deploy:domain
```

Esto intentará:

- crear/validar certificado ACM para `crcancinosandbox.click`,
- crear distribución CloudFront,
- crear registros A y AAAA Alias hacia CloudFront,
- publicar el frontend.

## Si el dominio está fuera de Route 53

Puedes desplegar primero sin dominio y usar la URL CloudFront. Para custom domain externo necesitas:

1. Crear un certificado ACM en `us-east-1` para `crcancinosandbox.click`.
2. Validarlo con los registros DNS que te entregue ACM.
3. Ejecutar el deploy con el ARN del certificado:

```bash
DOMAIN_NAME=crcancinosandbox.click \
CERTIFICATE_ARN=arn:aws:acm:us-east-1:TU_ACCOUNT_ID:certificate/ID_DEL_CERTIFICADO \
npm --workspace infra run deploy
```

Después apunta tu DNS hacia el dominio de CloudFront que aparece en el output `CloudFrontUrl`. Si quieres usar el dominio raíz/apex, muchos proveedores requieren un registro tipo ALIAS/ANAME; si no lo soportan, conviene mover DNS a Route 53.

## Cambiar qué audio es “sin IA” y cuál es “con IA”

Los audios no venían etiquetados, así que dejé el mapping editable en un solo archivo:

```txt
frontend/src/data/tracks.ts
```

Ahí puedes cambiar:

```ts
comparisonTracks.original
comparisonTracks.enhanced
```

## Nota sobre producción

Este frontend está listo como base visual y despliegue estático. El siguiente paso profesional sería agregar backend:

- autenticación con Cognito,
- uploads privados a S3,
- DynamoDB para sesiones,
- Step Functions para pipeline de análisis,
- worker en ECS/SageMaker para procesar audio,
- Bedrock para feedback pedagógico.
