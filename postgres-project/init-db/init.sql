CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    years_code_num DECIMAL(5,1) NOT NULL,
    converted_comp_yearly DECIMAL(12,2) NOT NULL,
    main_branch VARCHAR(100) NOT NULL,
    employment VARCHAR(100) NOT NULL,
    ed_level VARCHAR(100) NOT NULL,
    age VARCHAR(20) NOT NULL,
    org_size VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,

    prediction INTEGER NOT NULL CHECK (prediction IN (0, 1)),
    label VARCHAR(20) NOT NULL CHECK (label IN ('satisfied', 'not_satisfied')),
    probability_not_satisfied DECIMAL(5,4) NOT NULL,
    probability_satisfied DECIMAL(5,4) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

CREATE TABLE model_factors (
    id SERIAL PRIMARY KEY,
    factor_key VARCHAR(50) UNIQUE NOT NULL,
    factor_name_es VARCHAR(100) NOT NULL,
    factor_name_en VARCHAR(100) NOT NULL,
    importance_weight DECIMAL(5,2) NOT NULL,
    description_es TEXT,
    description_en TEXT
);

INSERT INTO model_factors (factor_key, factor_name_es, factor_name_en, importance_weight, description_es, description_en) VALUES
    ('experience',  'Años de experiencia profesional', 'Years of professional experience', 28.00, 'Impacto de los años de experiencia en el riesgo de fuga', 'Impact of years of experience on turnover risk'),
    ('salary',      'Salario anual',                   'Annual salary',                   22.00, 'Relación entre compensación y satisfacción laboral', 'Relationship between compensation and job satisfaction'),
    ('employment',  'Tipo de empleo',                   'Employment type',                 16.00, 'Influencia del tipo de contratación en la permanencia', 'Influence of employment type on retention'),
    ('education',   'Nivel educativo',                  'Education level',                 13.00, 'Correlación entre formación académica y expectativas profesionales', 'Correlation between education and career expectations'),
    ('role',        'Perfil profesional',               'Professional role',               10.00, 'Rol ocupacional como factor de riesgo', 'Occupational role as a risk factor'),
    ('companySize', 'Tamaño de empresa',                'Company size',                     6.00, 'Recursos y oportunidades según el tamaño de la organización', 'Resources and opportunities based on organization size'),
    ('country',     'País',                             'Country',                          3.00, 'Factores macroeconómicos y culturales del país', 'Country-level macroeconomic and cultural factors'),
    ('age',         'Edad',                             'Age',                              2.00, 'Etapa de carrera profesional vinculada a la edad', 'Career stage associated with age');

CREATE TABLE assessment_factors (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    factor_key VARCHAR(50) NOT NULL REFERENCES model_factors(factor_key),
    contribution DECIMAL(6,4)
);

CREATE UNIQUE INDEX idx_assessment_factors_unique ON assessment_factors(assessment_id, factor_key);

CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    dimension VARCHAR(50) NOT NULL CHECK (dimension IN (
        'experience', 'education', 'employment', 'companySize', 'country', 'professionalRole', 'age'
    )),
    segment_key VARCHAR(100) NOT NULL,
    label_es VARCHAR(100) NOT NULL,
    label_en VARCHAR(100) NOT NULL,
    risk_index DECIMAL(5,2),
    assessment_count INTEGER DEFAULT 0,
    UNIQUE(dimension, segment_key)
);
