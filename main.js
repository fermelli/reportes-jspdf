import './style.css';
import planillaData from './data/planilla.data.json';
import planillaPasajesData from './data/planilla-pasajes.data.json';
import {
    generarPlanillas,
    generarPlanillasPasajes,
} from './js/generar-pdfs.js';

document.querySelector('#app').innerHTML = /*html*/ `
    <div>
        <button id="js-generar-planillas">Generar Planillas</button>
        <button id="js-generar-planillas-pasajes">Generar Planillas Pasajes</button>

        <embed
            id="embed"
            src=""
            type="application/pdf"
            width="100%"
            height="800px"
        />
    </div>
`;

const $embed = document.querySelector('#embed');

document.querySelector('#js-generar-planillas').onclick = () => {
    $embed.src = generarPlanillas([planillaData, planillaData, planillaData]);
};

document.querySelector('#js-generar-planillas-pasajes').onclick = () => {
    $embed.src = generarPlanillasPasajes([
        planillaPasajesData,
        planillaPasajesData,
        planillaPasajesData,
    ]);
};
