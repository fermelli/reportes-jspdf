import './style.css';
import planillaData from './data/planilla.data.json';
import { generarPlanilla } from './js/generar-pdfs.js';

document.querySelector('#app').innerHTML = /*html*/ `
    <div>
        <embed
            id="embed"
            src=""
            type="application/pdf"
            width="100%"
            height="800px"
        />
        
        <button id="js-button-planilla" >Generar Planilla</button>
    </div>
`;

console.log(planillaData);

document.querySelector('#embed').src = generarPlanilla(planillaData);
