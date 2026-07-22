### Desarrollo sobre Modelos Ensemble

## Descripción
TalentCare AI es una plataforma de inteligencia de talento que utiliza modelos de ensemble machine learning para predecir patrones relacionados con la satisfacción laboral y el desarrollo profesional en el sector tecnológico. Mediante el análisis de miles de perfiles de desarrolladores, identifica diferencias en representación, progresión de carrera y bienestar entre hombres y mujeres, proporcionando a las empresas información basada en datos para impulsar estrategias de retención e inclusión más efectivas.

La aplicación también tiene una utilidad social para entidades sociales e instituciones públicas que deseen instaurar mejoras en el área de orientación sociolaboral que pueden ser de utilidad en acompañamientos en el sector social para mejorar esta realidad, como por ejemplo mejorando programas de sensibilización en diversas áreas y proyectos. 

 Además, para las instituciones públicas, como responsables de instaurar políticas y medidas que impulsen la equidad de género, también se conviete en una herramienta de gran utilidad que favorezca este impulso.


 
![Diagrama de propuesta stack](C:\Users\vdcm1\Downloads/1_propuesta.png)

![Diagrama de otra propuesta stack](C:\Users\vdcm1\Downloads2_propuesta_stack.png)

## Estructura del código


tree -a -L 6 -I "venv|.venv|node_modules|__pycache__|*.pyc" > estructura.md


|github
|__workflows
|__backend
|__backend
| |__app
|    |__ __init__
|    |__inference 
|    |__main.py
|    |__routes.oy
|    |__schemas.py
|__Dockerfile
|__data
|  |__processed
|  |__raw
|__docs
|  |__SDD
|  |__00_scope.md
|  |__01_requirements.md
|  |__02_architecture.md
|  |__03_implementation_structure.md
|  |__04_data_pipeline.md
|  |__05_modeling.md
|  |__06_frontend.md
|  |__07_api.md
|  |__08_testing.md
|  |__09_deployment
|__frontend
|  |__src
|  |  |__app.tsx
|  |  |__main.tsx
|  |__Dockerfile
|  |__package.json
|  |__vite.config.ts
|__models
./models/metrics
./models/pipelines
./models/trained
|  |__notebooks
|  |__scripts
|  |__src
|  |__tests
|  |__env.example
|  |__/ANEXOS.md


./backend/app/inference.py
./backend/app/main.py
./backend/app/routes.py
./backend/app/schemas.py
./backend/app/__init__.py
./backend/Dockerfile
./data/processed/.gitkeep
./data/raw/.gitkeep
./docker-compose.yml
./docs/SDD/00_scope.md
./docs/SDD/01_requirements.md
./docs/SDD/02_architecture.md
./docs/SDD/03_implementation_structure.md
./docs/SDD/04_data_pipeline.md
./docs/SDD/05_modeling.md
./docs/SDD/06_frontend.md
./docs/SDD/07_api.md
./docs/SDD/08_testing.md
./docs/SDD/09_deployment
./frontend/Dockerfile
./frontend/package.json
./frontend/src/app.tsx
./frontend/src/main.tsx
./frontend/vite.config.ts
./main.py
./models/metrics/.gitkeep
./models/pipelines/.gitkeep
./models/trained/.gitkeep
./notebooks/eda.py
./pyproject.toml
./README.md
./scripts/evaluate.py
./scripts/predict.py
./scripts/preprocess.py
./scripts/train.py
./src/data/loader.py
./src/data/preprocessing.py
./src/data/split.py
./src/data/validation.py
./src/evaluation/compare.py
./src/evaluation/evaluate.py
./src/evaluation/metrics.py
./src/evaluation/plots.py
./src/features/engineering.py
./src/features/selection.py
./src/inference/load_pipeline.py
./src/inference/predict.py
./src/training/baseline.py
./src/training/common.py
./src/training/ensemble.py
./src/training/random_forest.py
./src/training/train.py
./src/training/tuning.py
./src/training/xgboost.py
./src/__init__.py
./tests/test_backend.py
./tests/test_data.py
./tests/test_evaluation.py
./tests/test_inference.py
./tests/test_training.py
./__init__.py
