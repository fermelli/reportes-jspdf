import { jsPDF } from 'jspdf';
import logo from './../LogoSF2.png';

export const generarPlanilla = (datos) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        format: [80, 240],
    });
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

    doc.setProperties({
        title: 'Reporte de Planilla de Liquidación',
        subject: 'Planilla de Liquidación',
        author: nombreEmpresa,
    });

    /**
     * Cabecera del documento
     */
    doc.addImage(logo, 'PNG', 4, 4, 20, 20);
    doc.setFont('helvetica', 'bold').setFontSize(16);
    doc.text('SIN FRONTERAS', 76, 20, { align: 'right' });

    doc.setFontSize(12);
    doc.text('REPORTES', 40, 28, { align: 'center' });

    let y = 36;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold').text(
        `Flota "${nombreEmpresa}"`.toUpperCase(),
        40,
        y,
        {
            align: 'center',
        }
    );
    doc.text('PLANILLA DE LIQUIDACIÓN', 40, y + 4, { align: 'center' });

    doc.setFontSize(8);

    doc.setFont('helvetica', 'bold').text('Código:', 4, y + 8);
    doc.setFont('helvetica', 'normal').text(codigo, 16, y + 8);

    doc.setFont('helvetica', 'bold').text('Origen:', 4, y + 12);
    doc.setFont('helvetica', 'normal').text(origen, 16, y + 12);
    doc.setFont('helvetica', 'bold').text('Destino:', 44, y + 12, {
        align: 'right',
    });
    doc.setFont('helvetica', 'normal').text(destino, 46, y + 12, {
        align: 'left',
    });

    doc.setLineWidth(0.2).line(4, y + 16, 76, y + 16);

    /**
     * inicia Detalle de pasajes
     */

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('INGRESOS', 40, y + 24, { align: 'center' });

    // Cabecera del detalle de pasajes
    doc.setFontSize(8);
    doc.text('Cant.', 11, y + 32, { align: 'right' });
    doc.text('Detalle', 16, y + 32);
    doc.text('P. Unitario Bs.-', 58, y + 32, { align: 'right' });
    doc.text('Total Bs.-', 76, y + 32, { align: 'right' });

    // Cuerpo del detalle de pasajes
    y += 36;

    doc.setFont('helvetica', 'normal');

    boletos.forEach((boleto) => {
        const { numTickets, priceTicket, totalPrice } = boleto;
        const precio = Number(priceTicket);
        const subtotal = Number(totalPrice);

        doc.text(numTickets.toString(), 11, y, { align: 'right' });
        doc.text('Pasaje', 16, y);
        doc.text(precio.toFixed(2), 58, y, { align: 'right' });
        doc.text(subtotal.toFixed(2), 76, y, { align: 'right' });

        y += 4;
    });

    // Pie del detalle de pasajes
    doc.line(4, y, 76, y);

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PASAJES Bs.-', 58, y + 4, { align: 'right' });
    doc.text(total.toFixed(2), 76, y + 4, { align: 'right' });

    doc.text('TOTAL DESCUENTOS Bs.-', 58, y + 8, { align: 'right' });
    doc.text(totalDescuentos.toFixed(2), 76, y + 8, { align: 'right' });

    doc.text('TOTAL INGRESOS Bs.-', 58, y + 12, { align: 'right' });
    doc.text(totalIngresos.toFixed(2), 76, y + 12, { align: 'right' });

    /**
     * Termina Detalle de pasajes
     */

    /**
     * Inicia Detalle de gastos
     */

    doc.setFontSize(9);
    doc.text('EGRESOS', 40, y + 20, { align: 'center' });

    // Cabecera del detalle de gastos
    doc.setFontSize(8);
    doc.text('Detalle', 16, y + 28);
    doc.text('Monto Bs.-', 76, y + 28, { align: 'right' });

    // Cuerpo del detalle de gastos
    doc.setFont('helvetica', 'normal');

    let y1 = y + 32;

    doc.text('Diesel', 16, y1);
    doc.text(Number(diesel).toFixed(2), 76, y1, { align: 'right' });

    doc.text('Peaje', 16, y1 + 4);
    doc.text(Number(peaje).toFixed(2), 76, y1 + 4, { align: 'right' });

    doc.text('Viáticos', 16, y1 + 8);
    doc.text(Number(viaticos).toFixed(2), 76, y1 + 8, { align: 'right' });

    doc.text('Lavado', 16, y1 + 12);
    doc.text(Number(lavado).toFixed(2), 76, y1 + 12, { align: 'right' });

    doc.text('Sindicato', 16, y1 + 16);
    doc.text(Number(sindicato).toFixed(2), 76, y1 + 16, { align: 'right' });

    doc.text('Otros *', 16, y1 + 20);
    doc.text(Number(otros).toFixed(2), 76, y1 + 20, { align: 'right' });

    if (descripcionOtros) {
        y1 += 4;
        doc.setFontSize(7);
        doc.text(`* ${descripcionOtros}`, 4, y1 + 20);
        doc.setFontSize(8);
    }

    // Pie del detalle de gastos
    doc.line(4, y1 + 24, 76, y1 + 24);

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL EGRESOS Bs.-', 58, y1 + 28, { align: 'right' });
    doc.text(totalExpenses.toFixed(2), 76, y1 + 28, { align: 'right' });

    /**
     * Termina Detalle de gastos
     */

    doc.setFontSize(10);
    doc.text('LIQUIDACIÓN Bs.-', 58, y1 + 36, { align: 'right' });
    doc.text(totalLiquidacion.toFixed(2), 76, y1 + 36, { align: 'right' });

    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text(
        `Lugar y Fecha: ${origen.toUpperCase()} ${fechaViaje}`,
        40,
        y1 + 44,
        { align: 'center' }
    );

    // Firma del propietario
    doc.setLineDashPattern([1, 1]);
    doc.line(16, y1 + 60, 64, y1 + 60);
    doc.text('Recibí Conforme', 40, y1 + 64, { align: 'center' });
    doc.text('PROPIETARIO', 40, y1 + 68, { align: 'center' });

    const dataStrinng = doc.output('datauristring');

    return dataStrinng;
};
