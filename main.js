import './style.css';
import planillaData from './data/planilla.data.json';
import planillaPasajesData from './data/planilla-pasajes.data.json';
import manifiestoPasajerosData from './data/manifiesto-pasajeros.data.json';
import usuariosData from './data/usuarios.data.json';
import {
    generarListaUsuarios,
    generarManifiestoPasajeros,
    generarPlanillas,
    generarPlanillasPasajes,
} from './js/generar-pdfs.js';

document.querySelector('#app').innerHTML = /*html*/ `
    <div>
        <button id="js-generar-planillas">Generar Planillas</button>
        <button id="js-generar-planillas-pasajes">Generar Planillas Pasajes</button>
        <button id="js-generar-manifiesto-pasajeros">Generar Manifiesto Pasajeros</button>
        <button id="js-generar-lista-usuarios">Generar Lista Usuarios</button>

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

document
    .querySelector('#js-generar-manifiesto-pasajeros')
    .addEventListener('click', () => {
        eventoClick(() => {
            return generarManifiestoPasajeros(manifiestoPasajerosData);
        });
    });

document
    .querySelector('#js-generar-lista-usuarios')
    .addEventListener('click', () => {
        eventoClick(() => {
            return generarListaUsuarios(usuariosData);
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
