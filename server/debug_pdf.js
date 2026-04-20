const pdfParse = require('pdf-parse');
console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys of pdfParse:', Object.keys(pdfParse || {}));
if (pdfParse.PDFParse) {
  console.log('Type of pdfParse.PDFParse:', typeof pdfParse.PDFParse);
}
