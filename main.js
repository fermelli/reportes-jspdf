import './style.css';
import planillaData from './data/planilla.data.json';
import planillaPasajesData from './data/planilla-pasajes.data.json';
import {
    generarPlanillas,
    generarPlanillasPasajes,
} from './js/generar-pdfs.js';

document.querySelector('#app').innerHTML = /*html*/ `
    <div>
        <embed
            id="embed"
            src=""
            type="application/pdf"
            width="100%"
            height="800px"
        />
    </div>
`;

document.querySelector('#embed').src = generarPlanillasPasajes([
    planillaPasajesData,
    planillaPasajesData,
    planillaPasajesData,
]);
