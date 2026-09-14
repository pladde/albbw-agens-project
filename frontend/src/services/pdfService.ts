import { jsPDF } from 'jspdf';

export const pdfService = {
    createPdf: async () => {
        console.log('Hello jsPDF!');
        //
        const doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf")
    },

    getPdfContent: async () => {
        console.log('Hello PDF Content!');
    }
}