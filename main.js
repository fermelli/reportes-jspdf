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

        <div class="container">
            <div id="js-spinner" class="spinner"></div>

            <embed
                id="js-embed"
                src=""
                type="application/pdf"
                width="100%"
                height="800px"
            />
        </div>

    </div>
`;

const $embed = document.querySelector('#js-embed');
const $spinner = document.querySelector('#js-spinner');

$spinner.style.display = 'none';
$embed.style.display = 'none';

document
    .querySelector('#js-generar-planillas')
    .addEventListener('click', () => {
        eventoClick(() => {
            return generarPlanillas([planillaData, planillaData, planillaData]);
        });
    });

document
    .querySelector('#js-generar-planillas-pasajes')
    .addEventListener('click', () => {
        eventoClick(() => {
            return generarPlanillasPasajes([
                planillaPasajesData,
                planillaPasajesData,
                planillaPasajesData,
            ]);
        });
    });

const eventoClick = (fn) => {
    $embed.style.display = 'none';
    $spinner.style.display = 'block';

    const srcEmbed = fn();

    setTimeout(() => {
        $spinner.style.display = 'none';
        $embed.style.display = 'block';
        $embed.src = srcEmbed;
    }, 2000);
};
