import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './../LogoSF2_medium.png';

export const generarPlanillas = (datosPlanillas) => {
    const config = {
        ancho: 80,
        alto: 279.4,
        margenDerecho: 4,
        margenIzquierdo: 4,
        y: 0,
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

    imprimirPaginacion(doc, config);

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};

export const generarPlanillasPasajes = (datosPlanillasPasajes) => {
    const config = {
        ancho: 80,
        alto: 279.4,
        margenDerecho: 4,
        margenIzquierdo: 4,
        y: 0,
    };
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [config.ancho, config.alto],
        autoPaging: true,
    });

    doc.setProperties({
        title: 'Planilla de Pasajes',
        subject: 'Planilla de Pasajes',
    });

    datosPlanillasPasajes.forEach((datos, index) => {
        generarPlanillaPasajes(doc, config, datos);

        if (index < datosPlanillasPasajes.length - 1) {
            doc.addPage();
        }
    });

    imprimirPaginacion(doc, config);

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};

const imprimirPaginacion = (doc, config) => {
    const { ancho, alto } = config;
    // Paginación
    const numeroPaginas = doc.getNumberOfPages();

    for (let n = 1; n <= numeroPaginas; n++) {
        doc.setPage(n);
        doc.setFontSize(7);
        doc.text(`Página ${n} de ${numeroPaginas}`, ancho / 2, alto - 8, {
            align: 'center',
        });
    }
};

const dataCabecera = (doc, config, inicioDerecha, puntoMedio) => {
    const { margenIzquierdo } = config;

    const dataCabecera = [
        (doc) => {
            config.y += 4;
            doc.addImage(logo, 'PNG', margenIzquierdo, config.y, 20, 20);
        },
        (doc) => {
            config.y += 8;
            doc.setFont('helvetica', 'bold').setFontSize(16);
            doc.text('FLOTA', puntoMedio, config.y);
        },
        (doc) => {
            config.y += 6;
            doc.text('"SIN FRONTERAS"', inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.setFontSize(8);
            doc.text(
                'Empresa de Transporte de Pasajeros',
                inicioDerecha,
                config.y,
                {
                    align: 'right',
                }
            );
        },
    ];

    return dataCabecera;
};

const generarPlanilla = (doc, config, datos) => {
    const { ancho, margenDerecho, margenIzquierdo } = config;
    const puntoMedio = ancho / 2;
    const inicioDerecha = ancho - margenDerecho;
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

    config.y = 0;

    const docData = [
        ...dataCabecera(doc, config, inicioDerecha, puntoMedio),
        (doc) => {
            config.y += 12;
            doc.setFontSize(12);
            doc.text('REPORTES', puntoMedio, config.y, { align: 'center' });
        },
        (doc) => {
            config.y += 4;
            doc.setLineWidth(0.8).line(0, config.y, ancho, config.y);
        },
        (doc) => {
            config.y += 8;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold').text(
                `Flota "${nombreEmpresa}"`.toUpperCase(),
                puntoMedio,
                config.y,
                {
                    align: 'center',
                }
            );
        },
        (doc) => {
            config.y += 4;
            doc.text('PLANILLA DE LIQUIDACIÓN', puntoMedio, config.y, {
                align: 'center',
            });
        },
        (doc) => {
            config.y += 8;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold').text(
                'Código:',
                margenIzquierdo,
                config.y
            );
            doc.setFont('helvetica', 'normal').text(codigo, 16, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.setFont('helvetica', 'bold').text(
                'Origen:',
                margenIzquierdo,
                config.y
            );
            doc.setFont('helvetica', 'normal').text(
                origen.toUpperCase(),
                16,
                config.y
            );
            doc.setFont('helvetica', 'bold').text('Destino:', 40, config.y);
            doc.setFont('helvetica', 'normal').text(
                destino.toUpperCase(),
                53,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            doc.setLineWidth(0.2).line(
                margenIzquierdo,
                config.y,
                inicioDerecha,
                config.y
            );
        },
        (doc) => {
            /**
             * inicia Detalle de pasajes
             */
            config.y += 8;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text('INGRESOS', puntoMedio, config.y, { align: 'center' });
        },
        (doc) => {
            // Cabecera del detalle de pasajes
            config.y += 8;
            doc.setFontSize(8);
            doc.text('Cant.', 11, config.y, { align: 'right' });
            doc.text('Detalle', 16, config.y);
            doc.text('P. Unitario Bs.-', 58, config.y, { align: 'right' });
            doc.text('Total Bs.-', inicioDerecha, config.y, { align: 'right' });
        },
        (doc) => {
            // Cuerpo del detalle de pasajes

            doc.setFont('helvetica', 'normal');

            boletos.forEach((boleto) => {
                if (config.y >= doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    config.y = 8;
                }

                config.y += 4;

                const { numTickets, priceTicket, totalPrice } = boleto;
                const precio = Number(priceTicket);
                const subtotal = Number(totalPrice);

                doc.setFontSize(8);
                doc.text(numTickets.toString(), 11, config.y, {
                    align: 'right',
                });
                doc.text('Pasaje', 16, config.y);
                doc.text(precio.toFixed(2), 58, config.y, { align: 'right' });
                doc.text(subtotal.toFixed(2), inicioDerecha, config.y, {
                    align: 'right',
                });
            });
        },
        (doc) => {
            // Pie del detalle de pasajes
            config.y += 4;
            doc.line(margenIzquierdo, config.y, inicioDerecha, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL PASAJES Bs.-', 58, config.y, { align: 'right' });
            doc.text(total.toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('TOTAL DESCUENTOS Bs.-', 58, config.y, { align: 'right' });
            doc.text(totalDescuentos.toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('TOTAL INGRESOS Bs.-', 58, config.y, { align: 'right' });
            doc.text(totalIngresos.toFixed(2), inicioDerecha, config.y, {
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
            config.y += 8;
            doc.setFontSize(9);
            doc.text('EGRESOS', puntoMedio, config.y, { align: 'center' });
        },
        (doc) => {
            // Cabecera del detalle de gastos
            config.y += 8;
            doc.setFontSize(8);
            doc.text('Detalle', 16, config.y);
            doc.text('Monto Bs.-', inicioDerecha, config.y, { align: 'right' });
        },
        (doc) => {
            // Cuerpo del detalle de gastos
            config.y += 4;
            doc.setFont('helvetica', 'normal');
            doc.text('Diesel', 16, config.y);
            doc.text(Number(diesel).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('Peaje', 16, config.y);
            doc.text(Number(peaje).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('Viáticos', 16, config.y);
            doc.text(Number(viaticos).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('Lavado', 16, config.y);
            doc.text(Number(lavado).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('Sindicato', 16, config.y);
            doc.text(Number(sindicato).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('Otros *', 16, config.y);
            doc.text(Number(otros).toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            if (descripcionOtros) {
                config.y += 4;
                doc.setFontSize(7);
                doc.text(`* ${descripcionOtros}`, margenIzquierdo, config.y);
                doc.setFontSize(8);
            }
        },
        (doc) => {
            // Pie del detalle de gastos
            config.y += 4;
            doc.line(margenIzquierdo, config.y, inicioDerecha, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL EGRESOS Bs.-', 58, config.y, { align: 'right' });
            doc.text(totalExpenses.toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });

            /**
             * Termina Detalle de gastos
             */
        },
        (doc) => {
            config.y += 8;
            doc.setFontSize(10);
            doc.text('LIQUIDACIÓN Bs.-', 58, config.y, { align: 'right' });
            doc.text(totalLiquidacion.toFixed(2), inicioDerecha, config.y, {
                align: 'right',
            });
        },
        (doc) => {
            config.y += 8;
            doc.setFontSize(8).setFont('helvetica', 'normal');
            doc.text(
                `Lugar y Fecha: ${origen.toUpperCase()} ${fechaViaje}`,
                puntoMedio,
                config.y,
                { align: 'center' }
            );
        },
        (doc) => {
            // Firma del propietario
            config.y += 20;
            doc.setLineDashPattern([1, 1]);
            doc.line(16, config.y, 64, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.text('Recibí Conforme', puntoMedio, config.y, {
                align: 'center',
            });
        },
        (doc) => {
            config.y += 4;
            doc.text('PROPIETARIO', puntoMedio, config.y, { align: 'center' });
        },
        (doc) => {
            config.y += 4;
            doc.setLineDashPattern([0, 0])
                .setLineWidth(0.8)
                .line(0, config.y, ancho, config.y);
        },
    ];

    docData.forEach((data) => {
        if (config.y >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            config.y = 12;
        }

        data(doc);
    });
};

const generarPlanillaPasajes = (doc, config, datos) => {
    const { ancho, margenDerecho, margenIzquierdo } = config;
    const puntoMedio = ancho / 2;
    const inicioDerecha = ancho - margenDerecho;
    const pasajes = datos;

    config.y = 0;

    const docData = [
        ...dataCabecera(doc, config, inicioDerecha, puntoMedio),
        (doc) => {
            config.y += 12;
            doc.setFontSize(12);
            doc.text('PASAJES', puntoMedio, config.y, { align: 'center' });
        },
        (doc) => {
            pasajes.forEach((pasaje, indice) => {
                config.y += 4;
                doc.setLineWidth(0.5).line(0, config.y, ancho, config.y);

                config.y += 4;
                doc.addImage(logo, 'PNG', 10, config.y, 14, 14);

                doc.setFont('helvetica', 'bold')
                    .setFontSize(10)
                    .text('SIN FRONTERAS', puntoMedio / 2, config.y + 20, {
                        align: 'center',
                    });

                const margen = 15;

                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold').text(
                    'Sucursal:',
                    puntoMedio,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.branchNumber,
                    puntoMedio + margen + 2,
                    config.y
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'Ticket:',
                    puntoMedio,
                    config.y
                );
                imprimirCadenaLarga(
                    doc,
                    config,
                    pasaje.ticketNumber,
                    puntoMedio + margen,
                    15
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'Emitido por:',
                    puntoMedio,
                    config.y
                );
                imprimirCadenaLarga(
                    doc,
                    config,
                    pasaje.issuingUser,
                    puntoMedio + margen,
                    15
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'Teléfono:',
                    puntoMedio,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.branchPhone,
                    puntoMedio + margen + 2,
                    config.y
                );

                const origen = pasaje.origin.toUpperCase();
                const destino = pasaje.destiny.toUpperCase();

                config.y += 8;
                doc.setFont('helvetica', 'bold')
                    .setFontSize(10)
                    .text(`${origen} - ${destino}`, puntoMedio, config.y, {
                        align: 'center',
                    });

                config.y += 8;
                doc.setFontSize(7);

                doc.setFont('helvetica', 'bold').text(
                    'Fecha:',
                    margenIzquierdo,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.travelDate,
                    margen + 2,
                    config.y
                );

                doc.setFont('helvetica', 'bold').text(
                    'Asiento:',
                    puntoMedio,
                    config.y
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'Hora:',
                    margenIzquierdo,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.departureTime,
                    margen + 2,
                    config.y
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold')
                    .setFontSize(30)
                    .text(pasaje.seatId, puntoMedio + margen + 2, config.y);

                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold').text(
                    'Carril:',
                    margenIzquierdo,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.lane,
                    margen + 2,
                    config.y
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'Pasajero:',
                    margenIzquierdo,
                    config.y
                );
                imprimirCadenaLarga(
                    doc,
                    config,
                    pasaje.passengerFullName,
                    margen,
                    15
                );

                doc.setFont('helvetica', 'bold').text(
                    pasaje.typeOfSeat,
                    puntoMedio + 20,
                    config.y,
                    { align: 'center' }
                );

                config.y += 4;
                doc.setFont('helvetica', 'bold').text(
                    'C.I.:',
                    margenIzquierdo,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    pasaje.identificationNumber,
                    margen + 2,
                    config.y
                );

                doc.setFont('helvetica', 'bold').text(
                    'Precio:',
                    puntoMedio,
                    config.y
                );
                doc.setFont('helvetica', 'normal').text(
                    `${pasaje.seatPrice.toFixed(2)} Bs.-`,
                    puntoMedio + margen + 2,
                    config.y
                );

                config.y += 8;
                doc.setFont('helvetica', 'bold').text(
                    pasaje.legend,
                    puntoMedio,
                    config.y,
                    { align: 'center' }
                );

                config.y += 4;
                doc.line(0, config.y, ancho, config.y);

                if ((indice + 1) % 3 === 0) {
                    doc.addPage();

                    config.y = 12;
                }
            });
        },
    ];

    docData.forEach((data) => {
        if (config.y >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            config.y = 12;
        }

        data(doc);
    });
};

const imprimirCadenaLarga = (doc, config, cadena, x, tamanoMaximoCadena) => {
    if (cadena.length > tamanoMaximoCadena) {
        const parte1 = cadena.substring(0, tamanoMaximoCadena);
        const parte2 = cadena.substring(tamanoMaximoCadena);
        doc.setFont('helvetica', 'normal').text(parte1, x + 2, config.y);

        config.y += 4;
        doc.setFont('helvetica', 'normal').text(parte2, x + 2, config.y);
    } else {
        doc.setFont('helvetica', 'normal').text(cadena, x + 2, config.y);
    }
};

export const generarManifiestoPasajeros = (datosManifiesto) => {
    const config = {
        ancho: 215.9,
        alto: 279.4,
        margenDerecho: 12,
        margenIzquierdo: 12,
        y: 0,
    };
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [config.ancho, config.alto],
        autoPaging: true,
    });
    const { ancho, margenDerecho, margenIzquierdo } = config;
    const puntoMedio = ancho / 2;
    const { headerData, dataTable } = datosManifiesto;
    const {
        tripMadeKey,
        busEnrollment,
        fullNameDriver,
        origin,
        destiny,
        travelDate,
        departureTime,
        numberOfPassengers,
    } = headerData;
    const columnas = [
        { header: 'Código Pasaje', dataKey: 'ticketNumber' },
        { header: 'Nombre Completo', dataKey: 'passengerFullName' },
        { header: 'Nro. Documento', dataKey: 'identificationNumber' },
        { header: 'Tipo Documento', dataKey: 'typeOfDocument' },
        { header: 'Nro. Asiento', dataKey: 'seatId' },
    ];

    doc.setProperties({
        title: 'Manifiesto de Pasajeros',
        subject: 'Manifiesto de Pasajeros',
    });

    config.y = 0;

    const docData = [
        ...dataCabeceraTamanoCarta(doc, config, puntoMedio),
        (doc) => {
            config.y += 12;
            doc.setFontSize(12);
            doc.text('MANIFIESTO DE PASAJEROS', puntoMedio, config.y, {
                align: 'center',
            });
        },
        (doc) => {
            config.y += 8;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal').text(
                `CÓDIGO DE VIAJE: ${tripMadeKey}`,
                margenIzquierdo,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            doc.text(`NRO. PLACA: ${busEnrollment}`, margenIzquierdo, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.text(
                `NOMBRE DEL CHOFER: ${fullNameDriver}`,
                margenIzquierdo,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            doc.text(`ORIGEN: ${origin}`, margenIzquierdo, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.text(`DESTINO: ${destiny}`, margenIzquierdo, config.y);
        },
        (doc) => {
            config.y += 4;
            doc.text(
                `FECHA DE SALIDA: ${travelDate}`,
                margenIzquierdo,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            doc.text(
                `HORA DE SALIDA: ${departureTime}`,
                margenIzquierdo,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            doc.text(
                `NRO. DE PASAJEROS: ${numberOfPassengers}`,
                margenIzquierdo,
                config.y
            );
        },
        (doc) => {
            config.y += 4;
            autoTable(doc, {
                columns: columnas,
                body: dataTable,
                ...obtenerConfiguracionesAutoTable(
                    config.y,
                    ancho - margenIzquierdo - margenDerecho,
                    margenIzquierdo
                ),
            });
        },
    ];

    docData.forEach((data) => {
        if (config.y >= doc.internal.pageSize.height - 20) {
            doc.addPage();
            config.y = 12;
        }

        data(doc);
    });

    imprimirPaginacion(doc, config);

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};

const dataCabeceraTamanoCarta = (doc, config, puntoMedio) => {
    const tamanoLogo = 20;

    const dataCabecera = [
        (doc) => {
            config.y += 4;
            doc.addImage(
                logo,
                'PNG',
                puntoMedio - 2 * tamanoLogo,
                config.y,
                tamanoLogo,
                tamanoLogo
            );
        },
        (doc) => {
            config.y += 8;
            doc.setFont('helvetica', 'bold').setFontSize(16);
            doc.text('FLOTA', puntoMedio + tamanoLogo / 2, config.y, {
                align: 'center',
            });
        },
        (doc) => {
            config.y += 6;
            doc.text('"SIN FRONTERAS"', puntoMedio + tamanoLogo / 2, config.y, {
                align: 'center',
            });
        },
        (doc) => {
            config.y += 4;
            doc.setFontSize(8);
            doc.text(
                'Empresa de Transporte de Pasajeros',
                puntoMedio + tamanoLogo / 2,
                config.y,
                {
                    align: 'center',
                }
            );
        },
    ];

    return dataCabecera;
};

const obtenerConfiguracionesAutoTable = (y, anchoTabla, margenIzquierdo) => {
    return {
        startY: y,
        tableWidth: anchoTabla,
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
        },
        styles: {
            lineColor: [0, 0, 0],
            lineWidth: 0.25,
            textColor: [0, 0, 0],
            fontSize: 9,
        },
        margin: {
            top: 12,
            bottom: 12,
            left: margenIzquierdo,
        },
    };
};

export const generarListaUsuarios = (datosUsuarios) => {
    const config = {
        ancho: 215.9,
        alto: 279.4,
        margenDerecho: 12,
        margenIzquierdo: 12,
        y: 0,
    };
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [config.ancho, config.alto],
        autoPaging: true,
    });
    const { ancho, margenDerecho, margenIzquierdo } = config;
    const puntoMedio = ancho / 2;
    const { usersData } = datosUsuarios;
    const columnas = [
        { header: 'Carnet Identidad', dataKey: 'identificationNumber' },
        { header: 'Nombre Completo', dataKey: 'userFullName' },
        { header: 'Cargo', dataKey: 'charge' },
        { header: 'Celular', dataKey: 'mobile' },
        { header: 'Estado', dataKey: 'status' },
    ];

    doc.setProperties({
        title: 'Lista de Pasajeros',
        subject: 'Lista de Pasajeros',
    });

    config.y = 0;

    if (usersData.length === 0) {
        doc.setFontSize(12);
        doc.text('NO SE ENCONTRARON REGISTROS', puntoMedio, config.y, {
            align: 'center',
        });
    } else {
        const branchNumberOrCode =
            usersData.length > 0 ? usersData[0].branchNumberOrCode : '';
        const branchOfficeName =
            usersData.length > 0 ? usersData[0].branchOfficeName : '';
        const printDate = new Date().toLocaleDateString();

        const docData = [
            ...dataCabeceraTamanoCarta(doc, config, puntoMedio),
            (doc) => {
                config.y += 12;
                doc.setFontSize(12);
                doc.text('LISTA DE USUARIOS', puntoMedio, config.y, {
                    align: 'center',
                });
            },
            (doc) => {
                config.y += 8;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal').text(
                    `CÓDIGO DE SUCURSAL: ${branchNumberOrCode}`,
                    margenIzquierdo,
                    config.y
                );
            },
            (doc) => {
                config.y += 4;
                doc.text(
                    `NOMBRE DE SUCURSAL: ${branchOfficeName}`,
                    margenIzquierdo,
                    config.y
                );
            },
            (doc) => {
                config.y += 4;
                doc.text(
                    `FECHA DE IMPRESIÓN: ${printDate}`,
                    margenIzquierdo,
                    config.y
                );
            },
            (doc) => {
                config.y += 4;
                autoTable(doc, {
                    columns: columnas,
                    body: usersData,
                    ...obtenerConfiguracionesAutoTable(
                        config.y,
                        ancho - margenIzquierdo - margenDerecho,
                        margenIzquierdo
                    ),
                });
            },
        ];

        docData.forEach((data) => {
            if (config.y >= doc.internal.pageSize.height - 20) {
                doc.addPage();
                config.y = 12;
            }

            data(doc);
        });
    }

    imprimirPaginacion(doc, config);

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};
