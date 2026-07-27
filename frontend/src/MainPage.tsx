import React, { useState } from 'react';

// 1. DEFINICIÓN DE TIPOS (CONTRATO API CON TYPESCRIPT)
interface PredictRequest {
  years_code_pro: number;
  ed_level: string;
  remote_work: string;
  language_have_worked_with: string;
  converted_comp_yearly: number;
}

interface TopFactor {
  feature: string;
  importance: number;
}

interface PredictResponse {
  prediction: number;
  label: 'Satisfecho' | 'En Riesgo de Salida';
  probability: number;
  top_factors: TopFactor[];
}

export const MainPage: React.FC = () => {
  // 2. ESTADOS DE REACT PARA CONTROLAR LA INTERFAZ SECUENCIAL
  const [formData, setFormData] = useState<PredictRequest>({
    years_code_pro: 3,
    ed_level: "Bachelor's degree",
    remote_work: "Hybrid",
    language_have_worked_with: "TypeScript",
    converted_comp_yearly: 42000,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  // Mapeo de variables técnicas del dataset a nombres legibles en la UI
  const featureLabels: Record<string, string> = {
    remote_work: "Modalidad de trabajo",
    converted_comp_yearly: "Compensación económica",
    years_code_pro: "Experiencia profesional",
    ed_level: "Nivel educativo",
    language_have_worked_with: "Tecnología principal"
  };

  // 3. MOTOR DE SIMULACIÓN LOCAL (MOCK DE INFERENCIA CON RED TRASLAZADA 1.5s)
  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Latencia artificial para evaluar los estados de carga visuales en VSC
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Lógica interna reactiva para simular el comportamiento esperado del backend
    const hasGoodConditions = formData.converted_comp_yearly >= 45000 || formData.remote_work === 'Remote';

    setResult({
      prediction: hasGoodConditions ? 1 : 0,
      label: hasGoodConditions ? 'Satisfecho' : 'En Riesgo de Salida',
      probability: hasGoodConditions ? 0.84 : 0.76,
      top_factors: [
        { feature: 'remote_work', importance: 0.38 },
        { feature: 'converted_comp_yearly', importance: 0.31 },
        { feature: 'years_code_pro', importance: 0.18 }
      ]
    });
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-16">
      
      {/* BLOQUE 1 — INFORMACIÓN DE LA PLATAFORMA (UC-01) */}
      <header className="bg-white border-b border-gray-200 py-10 px-4 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-bold text-indigo-600 tracking-wide uppercase mb-2">TalentCare MVP</div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simulador de Retención de Talento STEM
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Optimiza los entornos laborales técnicos y apoya el cumplimiento normativo de tus Planes de Igualdad mediante analítica explicable.
          </p>
          
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md max-w-2xl mx-auto text-left">
            <div className="flex">
              <span className="text-xl mr-3" role="img" aria-label="shield">🔒</span>
              <p className="text-sm text-blue-700">
                <strong>Privacidad de Datos Activa:</strong> Este entorno opera de forma 100% transitoria y anónima para auditorías rápidas de perfiles de puesto. No requiere la introducción de identidades personales de acuerdo con la legislación vigente.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* BLOQUE 2 — FORMULARIO DE ENTRADA (UC-02, UC-03) */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2" role="img" aria-label="form">📝</span> Parámetros del Entorno Laboral
          </h2>
          
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Años de experiencia profesional</label>
                <input 
                  type="number" 
                  min="0" max="50"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.years_code_pro}
                  onChange={e => setFormData({...formData, years_code_pro: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel educativo alcanzado</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.ed_level}
                  onChange={e => setFormData({...formData, ed_level: e.target.value})}
                >
                  <option value="Bachelor's degree">Grado Universitario / Ingeniería</option>
                  <option value="Master's degree">Máster Profesional / Postgrado</option>
                  <option value="Doctorate">Doctorado (PhD)</option>
                  <option value="Something else">Otros estudios técnicos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad de jornada asignada</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.remote_work}
                  onChange={e => setFormData({...formData, remote_work: e.target.value})}
                >
                  <option value="Remote">100% Remoto (Flexibilidad Espacial)</option>
                  <option value="Hybrid">Híbrido (Presencialidad Flexible)</option>
                  <option value="In-person">100% Presencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ecosistema técnico principal</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.language_have_worked_with}
                  onChange={e => setFormData({...formData, language_have_worked_with: e.target.value})}
                >
                  <option value="TypeScript">TypeScript / JavaScript</option>
                  <option value="Python">Python (Data Science & AI)</option>
                  <option value="Go">Go / Rust (Sistemas de Infraestructura)</option>
                  <option value="Java">Java / C# (Ecosistemas Backend Enterprise)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Compensación económica bruta anual (€)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.converted_comp_yearly}
                  onChange={e => setFormData({...formData, converted_comp_yearly: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN CON INDICADOR DE CARGA (UC-04) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg text-white font-bold tracking-wide transition shadow ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando inferencia con XAI...
                </div>
              ) : (
                'Ejecutar Simulación de Retención'
              )}
            </button>
          </form>
        </section>

        {/* PANELES DE INFERENCIA INTERACTIVOS: VISIBLES TRAS RESPUESTA */}
        {result && (
          <div className="space-y-8">
            
            {/* BLOQUE 3 — RESULTADO DE LA PREDICCIÓN (UC-05) */}
            <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2" role="img" aria-label="chart">📊</span> Diagnóstico de Satisfacción Laboral
              </h2>

{/* BLOQUE 4 — EXPLICACIÓN / IMPORTANCIA DE VARIABLES (UC-06) */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">Resultado</h3>
  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
    <div>
      <div className="text-sm text-gray-600">Estado</div>
      <div className={`mt-1 text-xl font-bold ${result.prediction === 1 ? 'text-green-600' : 'text-red-600'}`}>
        {result.label}
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-600">Confianza</div>
      <div className="mt-1 text-xl font-bold text-gray-800">{Math.round(result.probability * 100)}%</div>
    </div>
  </div>
</div>

{/* Importancias (top factors) */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">Factores más relevantes</h3>
  <ul className="space-y-3">
    {result.top_factors.map((f, idx) => (
      <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
        <div className="text-sm text-gray-700">{featureLabels[f.feature] ?? f.feature}</div>
        <div className="text-sm font-semibold text-gray-800">{Math.round(f.importance * 100)}%</div>
      </li>
    ))}
  </ul>
</div>

{/* BLOQUE 5 — RECOMENDACIONES (UC-07) */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones rápidas</h3>
  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
    <li>Ajustar la política salarial si la compensación es inferior al mercado.</li>
    <li>Valorar opciones de teletrabajo cuando sea viable para retener talento.</li>
    <li>Incentivar planes de desarrollo profesional para reducir rotación.</li>
  </ol>
</div>

{/* BLOQUE 6 — NUEVO ANÁLISIS (UC-08) */}
<div className="text-center pt-4">
  <button
    onClick={handleReset}
    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 active:bg-gray-100 transition shadow-sm"
  >
    🔄 Realizar un Nuevo Diagnóstico
  </button>
</div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};