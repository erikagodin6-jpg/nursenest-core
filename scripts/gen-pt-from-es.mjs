#!/usr/bin/env node
/** Rough ES→PT-BR pass for tools keys; review in production. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const es = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../tools/i18n/marketing/locale/marketing-es.json"), "utf8"));

function pt(s) {
  return s
    .replace(/Herramientas/g, "Ferramentas")
    .replace(/herramientas/g, "ferramentas")
    .replace(/Centro de herramientas/g, "Central de ferramentas")
    .replace(/clínicas/g, "clínicas")
    .replace(/Cálculo de medicamentos/g, "Cálculo de medicamentos")
    .replace(/valores de laboratorio/g, "valores de laboratório")
    .replace(/práctica de ABG/g, "prática de ABG")
    .replace(/calculadoras ligeras/g, "calculadoras leves")
    .replace(/para estudiar/g, "para estudar")
    .replace(/Todas las herramientas/g, "Todas as ferramentas")
    .replace(/Calculadoras de enfermería gratuitas/g, "Calculadoras de enfermagem gratuitas")
    .replace(/matemáticas de medicamentos/g, "matemática de medicamentos")
    .replace(/interpretación ácido-base/g, "interpretação ácido-base")
    .replace(/Solo educativo/g, "Somente educativo")
    .replace(/Siga las políticas de su centro/g, "Siga as políticas do seu centro")
    .replace(/las órdenes médicas/g, "as prescrições médicas")
    .replace(/el ámbito de práctica local/g, "o âmbito de prática local")
    .replace(/Matemáticas de medicamentos/g, "Matemática de medicamentos")
    .replace(/Velocidades de goteo IV/g, "Velocidades de gotejamento IV")
    .replace(/volúmenes de dosis líquidas/g, "volumes de dose líquida")
    .replace(/según la concentración ordenada/g, "segundo a concentração prescrita")
    .replace(/Intervalos de referencia adultos comunes/g, "Intervalos de referência adultos comuns")
    .replace(/para repaso rápido/g, "para revisão rápida")
    .replace(/Simulador de electrolitos/g, "Simulador de eletrólitos")
    .replace(/Clasifique patrones/g, "Classifique padrões")
    .replace(/bicarbonato/g, "bicarbonato")
    .replace(/Calculadora de matemáticas de medicamentos/g, "Calculadora de matemática de medicamentos")
    .replace(/Calcule velocidades de infusión IV/g, "Calcule velocidades de infusão IV")
    .replace(/volúmenes para dosis ordenadas/g, "volumes para doses prescritas")
    .replace(/Velocidad de goteo IV/g, "Velocidade de gotejamento IV")
    .replace(/Volumen de dosis líquida/g, "Volume de dose líquida")
    .replace(/Minutos/g, "Minutos")
    .replace(/Factor de gotas/g, "Fator de gotas")
    .replace(/Velocidad de flujo/g, "Velocidade de fluxo")
    .replace(/Introduzca números positivos/g, "Introduza números positivos")
    .replace(/Cantidad ordenada dividida/g, "Quantidade prescrita dividida")
    .replace(/multiplicada por el volumen que contiene esa concentración/g, "multiplicada pelo volume que contém essa concentração")
    .replace(/Dosis ordenada/g, "Dose prescrita")
    .replace(/Medicamento por volumen/g, "Medicamento por volume")
    .replace(/Volumen que contiene esa cantidad/g, "Volume que contém essa quantidade")
    .replace(/debe ser mayor que cero/g, "deve ser maior que zero")
    .replace(/Volumen a administrar/g, "Volume a administrar")
    .replace(/Explore rangos de referencia/g, "Explore intervalos de referência")
    .replace(/química y hematología/g, "química e hematologia")
    .replace(/Buscar por prueba/g, "Pesquisar por exame")
    .replace(/Prueba/g, "Exame")
    .replace(/Referencia típica/g, "Referência típica")
    .replace(/Unidad/g, "Unidade")
    .replace(/Los intervalos varían según el laboratorio/g, "Os intervalos variam conforme o laboratório")
    .replace(/verifique los rangos de su centro/g, "verifique os intervalos do seu centro")
    .replace(/Sodio/g, "Sódio")
    .replace(/Potasio/g, "Potássio")
    .replace(/Cloro/g, "Cloro")
    .replace(/Glucosa \(ayuno\)/g, "Glicose (jejum)")
    .replace(/Leucocitos/g, "Leucócitos")
    .replace(/Practique la clasificación/g, "Pratique a classificação")
    .replace(/trastornos ácido-base/g, "distúrbios ácido-base")
    .replace(/gasometría arterial/g, "gasometria arterial")
    .replace(/Introduzca los componentes medidos/g, "Introduza os componentes medidos")
    .replace(/Patrón educativo simplificado/g, "Padrão educativo simplificado")
    .replace(/no sustituye la interpretación clínica completa/g, "não substitui a interpretação clínica completa")
    .replace(/Introduzca valores numéricos/g, "Introduza valores numéricos")
    .replace(/Restablecer ejemplo/g, "Redefinir exemplo")
    .replace(/No reemplaza el anión gap/g, "Não substitui o ânion gap")
    .replace(/compensación esperada/g, "compensação esperada")
    .replace(/trastornos mixtos complejos/g, "distúrbios mistos complexos")
    .replace(/dentro del rango habitual/g, "dentro do intervalo habitual")
    .replace(/sin trastorno ácido-base primario solo con estos valores/g, "sem distúrbio ácido-base primário apenas com estes valores")
    .replace(/Patrón de acidosis respiratoria primaria/g, "Padrão de acidose respiratória primária")
    .replace(/Patrón de acidosis metabólica primaria/g, "Padrão de acidose metabólica primária")
    .replace(/Patrón de alcalosis respiratoria primaria/g, "Padrão de alcalose respiratória primária")
    .replace(/Patrón de alcalosis metabólica primaria/g, "Padrão de alcalose metabólica primária")
    .replace(/Trastorno mixto, compensación o patrón límite/g, "Distúrbio misto, compensação ou padrão limite")
    .replace(/interpretar con contexto clínico y ABG completo/g, "interpretar com contexto clínico e ABG completo");
}

const out = {};
for (const [k, v] of Object.entries(es)) {
  out[k] = pt(v);
}

fs.writeFileSync(path.join(__dirname, "../../../tools/i18n/marketing/locale/marketing-pt.json"), JSON.stringify(out, null, 2) + "\n");
console.log("wrote marketing-pt.json", Object.keys(out).length);
