# Software Design Document (SDD)

# SDD-09 · Deployment

| Campo | Valor |
|---|---|
| Proyecto | TalentCare AI |
| Documento | Deployment |
| Código | SDD-09 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-01, SDD-02, SDD-03 |
| Documentos relacionados | SDD-07, SDD-08 |

---

## 1. Arquitectura de despliegue

```text
Usuario
    │
    ▼
Frontend Container  (React + Vite)
    │
    │ HTTP / REST
    ▼
Backend Container   (FastAPI + Uvicorn)
    │
    │ Carga en arranque
    ▼
Model Artifacts     (models/)
```

---

## 2. Componentes

| Servicio | Ubicación | Tecnología | Estado |
|---|---|---|---|
| Frontend | `frontend/` | React, TypeScript, Vite | Parcial |
| Backend | `backend/` | FastAPI, Python, Uvicorn | Parcial |
| Artefactos ML | `models/` | joblib / pickle | Pendiente |

---

## 3. Contenedores

| Archivo | Responsabilidad | Estado |
|---|---|---|
| `frontend/Dockerfile` | Build y servicio del frontend | Previsto |
| `backend/Dockerfile` | Arranque del backend | Previsto |
| `docker-compose.yml` | Orquestación de servicios | Previsto |

### docker-compose.yml gestiona

- Definición de servicios.
- Red interna entre contenedores.
- Variables de entorno.
- Montaje de artefactos del modelo.
- Arranque ordenado.

---

## 4. Variables de entorno

Plantilla en `.env.example`:

```env
APP_ENV=development
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=models/pipelines/pipeline.joblib
MODEL_METADATA_PATH=models/pipelines/metadata.json
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173
```

El archivo `.env` no se versiona. No se incluyen secretos en el repositorio.

---

## 5. CI/CD

| Archivo | Triggers | Pasos | Estado |
|---|---|---|---|
| `.github/workflows/ci.yml` | Push / PR a `main` y `dev` | checkout → setup-python → uv sync → pytest | Implementado |

Ninguna PR se fusiona si el CI falla.

Pasos previstos para ampliar el pipeline:

```text
1. Instalación de dependencias
2. Linting
3. Tests unitarios
4. Tests de integración
5. Build de contenedores
6. Validación de despliegue
```

---

## 6. Entornos

| Entorno | Propósito | Estado |
|---|---|---|
| Development | Desarrollo local con Docker Compose | Previsto |
| Testing | Validación automática en CI | Implementado (pytest) |
| Production | Despliegue optimizado | Pendiente |

---

## 7. Despliegue local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Bootcamp-IA-MAD-P7/Proyecto6-Grupo2.git

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Construir contenedores
docker compose build

# 4. Arrancar la aplicación
docker compose up
```

---

## 8. Estrategia del modelo

```text
Entrenamiento (local / CI)
        │
        ▼
Pipeline serializado → models/pipelines/
        │
        ▼
Montado en el backend container
        │
        ▼
Cargado una vez al arrancar FastAPI
        │
        ▼
Disponible para inferencia
```

El artefacto debe contener preprocesado, transformaciones y modelo. No se recarga en cada petición.

---

## 9. Observabilidad

| Capa | Qué se registra | Estado |
|---|---|---|
| Backend | Arranque, carga del modelo, versión, errores, duración de inferencia | Previsto |
| Frontend | Errores de cliente, fallos de API | Previsto |
| CI | Resultados de tests, fallos de build | Implementado |

Los logs no incluirán datos personales ni secretos (NFR-037 en SDD-01).

---

## 10. Seguridad

| Práctica | Estado |
|---|---|
| Secretos fuera del repositorio | Implementado (.gitignore) |
| Validación de entradas en API | Previsto (Pydantic) |
| Variables de entorno para configuración | Previsto |
| Dependencias versionadas | Implementado (uv.lock) |

---

## 11. Escalabilidad prevista

Las siguientes capacidades no forman parte del MVP:

- Múltiples instancias del backend.
- Balanceo de carga.
- Despliegue en cloud.
- Servicio de inferencia independiente.
- Reentrenamiento automático.
- Model registry.

---

## 12. Trazabilidad

| Documento | Relación |
|---|---|
| SDD-01 · Requirements | NFR-004, NFR-005, NFR-030, NFR-036, NFR-037 |
| SDD-02 · Architecture | Sección 15 Despliegue conceptual |
| SDD-03 · Implementation Structure | Sección 7 Configuración, Sección 18 CI |
| SDD-07 · API | Configuración de CORS y puertos |
| SDD-08 · Testing | Integración con CI |
