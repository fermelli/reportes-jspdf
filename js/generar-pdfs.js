import { jsPDF } from 'jspdf';
import logo from './../LogoSF2.png';

export const generarPlanillas = (datosPlanillas) => {
    const config = {
        ancho: 80,
        alto: 279.4,
        margenDerecho: 4,
        margenIzquierdo: 4,
    };
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [config.ancho, config.alto],
        autoPaging: true,
    });
    doc.setProperties({
        title: 'Reporte de Planilla de Liquidación',
        subject: 'Planilla de Liquidación',
    });

    datosPlanillas.forEach((datos, index) => {
        generarPlanilla(doc, config, datos);

        if (index < datosPlanillas.length - 1) {
            doc.addPage();
        }
    });

    // Paginación
    const numeroPaginas = doc.getNumberOfPages();

    for (let n = 1; n <= numeroPaginas; n++) {
        doc.setPage(n);
        doc.setFontSize(7);
        doc.text(
            `Página ${n} de ${numeroPaginas}`,
            config.ancho / 2,
            config.alto - 8,
            {
                align: 'center',
            }
        );
    }

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};

const generarPlanilla = (doc, config, datos) => {
    const { ancho, margenDerecho, margenIzquierdo } = config;
    const puntoMedio = ancho / 2;
    const inicioDerecha = ancho - margenDerecho;
    let y = 0;
    const {
        companyName: nombreEmpresa,
        formCode: codigo,
        origin: origen,
        destiny: destino,
        travelIncome: detallePasajes,
        travelExpenses: detalleGastos,
        totalSettlement: totalLiquidacion,
        travelDate: fechaViaje,
    } = datos;
    const {
        incomeTickets: boletos,
        totalAmountTickets: total,
        totalAmountDiscounts: totalDescuentos,
        totalAmountIncome: totalIngresos,
    } = detallePasajes;
    const {
        diesel,
        laborUnion: sindicato,
        otherDescription: descripcionOtros,
        others: otros,
        toll: peaje,
        viaticos,
        washed: lavado,
    } = detalleGastos.expenses;
    const { totalExpenses } = detalleGastos;
    /**
     * Cabecera del documento
     */
    const docData = [
        (doc) => {
            y += 4;
            doc.addImage(logo, 'PNG', margenIzquierdo, y, 20, 20);
        },
        (doc) => {
            y += 8;
            doc.setFont('helvetica', 'bold').setFontSize(16);
            doc.text('FLOTA', puntoMedio, y);
        },
        (doc) => {
            y += 6;
            doc.text('"SIN FRONTERAS"', inicioDerecha, y, { align: 'right' });
        },
        (doc) => {
            y += 4;
            doc.setFontSize(8);
            doc.text('Empresa de Transporte de Pasajeros', inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 12;
            doc.setFontSize(12);
            doc.text('REPORTES', puntoMedio, y, { align: 'center' });
        },
        (doc) => {
            y += 8;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold').text(
                `Flota "${nombreEmpresa}"`.toUpperCase(),
                puntoMedio,
                y,
                {
                    align: 'center',
                }
            );
        },
        (doc) => {
            y += 4;
            doc.text('PLANILLA DE LIQUIDACIÓN', puntoMedio, y, {
                align: 'center',
            });
        },
        (doc) => {
            y += 8;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold').text(
                'Código:',
                margenIzquierdo,
                y
            );
            doc.setFont('helvetica', 'normal').text(codigo, 16, y);
        },
        (doc) => {
            y += 4;
            doc.setFont('helvetica', 'bold').text(
                'Origen:',
                margenIzquierdo,
                y
            );
            doc.setFont('helvetica', 'normal').text(
                origen.toUpperCase(),
                16,
                y
            );
            doc.setFont('helvetica', 'bold').text('Destino:', 40, y);
            doc.setFont('helvetica', 'normal').text(
                destino.toUpperCase(),
                53,
                y
            );
        },
        (doc) => {
            y += 4;
            doc.setLineWidth(0.2).line(margenIzquierdo, y, inicioDerecha, y);
        },
        (doc) => {
            /**
             * inicia Detalle de pasajes
             */
            y += 8;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text('INGRESOS', puntoMedio, y, { align: 'center' });
        },
        (doc) => {
            // Cabecera del detalle de pasajes
            y += 8;
            doc.setFontSize(8);
            doc.text('Cant.', 11, y, { align: 'right' });
            doc.text('Detalle', 16, y);
            doc.text('P. Unitario Bs.-', 58, y, { align: 'right' });
            doc.text('Total Bs.-', inicioDerecha, y, { align: 'right' });
        },
        (doc) => {
            // Cuerpo del detalle de pasajes

            doc.setFont('helvetica', 'normal');

            boletos.forEach((boleto) => {
                if (y >= doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = 8;
                }

                y += 4;

                const { numTickets, priceTicket, totalPrice } = boleto;
                const precio = Number(priceTicket);
                const subtotal = Number(totalPrice);

                doc.setFontSize(8);
                doc.text(numTickets.toString(), 11, y, { align: 'right' });
                doc.text('Pasaje', 16, y);
                doc.text(precio.toFixed(2), 58, y, { align: 'right' });
                doc.text(subtotal.toFixed(2), inicioDerecha, y, {
                    align: 'right',
                });
            });
        },
        (doc) => {
            // Pie del detalle de pasajes
            y += 4;
            doc.line(margenIzquierdo, y, inicioDerecha, y);
        },
        (doc) => {
            y += 4;
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL PASAJES Bs.-', 58, y, { align: 'right' });
            doc.text(total.toFixed(2), inicioDerecha, y, { align: 'right' });
        },
        (doc) => {
            y += 4;
            doc.text('TOTAL DESCUENTOS Bs.-', 58, y, { align: 'right' });
            doc.text(totalDescuentos.toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('TOTAL INGRESOS Bs.-', 58, y, { align: 'right' });
            doc.text(totalIngresos.toFixed(2), inicioDerecha, y, {
                align: 'right',
            });

            // /**
            //  * Termina Detalle de pasajes
            //  */
        },
        (doc) => {
            /**
             * Inicia Detalle de gastos
             */
            y += 8;
            doc.setFontSize(9);
            doc.text('EGRESOS', puntoMedio, y, { align: 'center' });
        },
        (doc) => {
            // Cabecera del detalle de gastos
            y += 8;
            doc.setFontSize(8);
            doc.text('Detalle', 16, y);
            doc.text('Monto Bs.-', inicioDerecha, y, { align: 'right' });
        },
        (doc) => {
            // Cuerpo del detalle de gastos
            y += 4;
            doc.setFont('helvetica', 'normal');
            doc.text('Diesel', 16, y);
            doc.text(Number(diesel).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('Peaje', 16, y);
            doc.text(Number(peaje).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('Viáticos', 16, y);
            doc.text(Number(viaticos).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('Lavado', 16, y);
            doc.text(Number(lavado).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('Sindicato', 16, y);
            doc.text(Number(sindicato).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 4;
            doc.text('Otros *', 16, y);
            doc.text(Number(otros).toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            if (descripcionOtros) {
                y += 4;
                doc.setFontSize(7);
                doc.text(`* ${descripcionOtros}`, margenIzquierdo, y);
                doc.setFontSize(8);
            }
        },
        (doc) => {
            // Pie del detalle de gastos
            y += 4;
            doc.line(margenIzquierdo, y, inicioDerecha, y);
        },
        (doc) => {
            y += 4;
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL EGRESOS Bs.-', 58, y, { align: 'right' });
            doc.text(totalExpenses.toFixed(2), inicioDerecha, y, {
                align: 'right',
            });

            /**
             * Termina Detalle de gastos
             */
        },
        (doc) => {
            y += 8;
            doc.setFontSize(10);
            doc.text('LIQUIDACIÓN Bs.-', 58, y, { align: 'right' });
            doc.text(totalLiquidacion.toFixed(2), inicioDerecha, y, {
                align: 'right',
            });
        },
        (doc) => {
            y += 8;
            doc.setFontSize(8).setFont('helvetica', 'normal');
            doc.text(
                `Lugar y Fecha: ${origen.toUpperCase()} ${fechaViaje}`,
                puntoMedio,
                y,
                { align: 'center' }
            );
        },
        (doc) => {
            // Firma del propietario
            y += 20;
            doc.setLineDashPattern([1, 1]);
            doc.line(16, y, 64, y);
        },
        (doc) => {
            y += 4;
            doc.text('Recibí Conforme', puntoMedio, y, { align: 'center' });
        },
        (doc) => {
            y += 4;
            doc.text('PROPIETARIO', puntoMedio, y, { align: 'center' });
        },
    ];

    docData.forEach((data) => {
        if (y >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            y = 12;
        }

        data(doc);
    });
};
