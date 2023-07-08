import './style.css';
import planillaData from './data/planilla.data.json';
import { generarPlanillas } from './js/generar-pdfs.js';

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

document.querySelector('#embed').src = generarPlanillas([
    planillaData,
    planillaData,
    planillaData,
]);
