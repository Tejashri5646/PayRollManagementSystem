const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const generatePDF = async (employeeInfo, res) => {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=employeeInfo.pdf');

    doc.pipe(res);

    doc.fontSize(25).text('Employee Information', { align: 'center' });
    doc.moveDown();

    employeeInfo.forEach(emp => {
        doc.fontSize(12).text(`Employee Code: ${emp.eCode}`);
        doc.text(`Name: ${emp.eName}`);
        doc.text(`Grade: ${emp.gradCode}`);
        doc.text(`Branch: ${emp.branchCode}`);
        doc.text(`Section: ${emp.sectCode}`);
        doc.moveDown();
    });

    doc.end();
};

const generateExcel = async (employeeInfo, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Information');

    worksheet.columns = [
        { header: 'Employee Code', key: 'eCode', width: 10 },
        { header: 'Name', key: 'eName', width: 25 },
        { header: 'Grade', key: 'gradCode', width: 15 },
        { header: 'Branch', key: 'branchCode', width: 10 },
        { header: 'Section', key: 'sectCode', width: 10 },
        { header: 'Type', key: 'Type', width: 15 },
        { header: 'Joining Date', key: 'joiningDate', width: 15 },
        { header: 'Permanent Date', key: 'permDate', width: 15 },
        { header: 'Basic', key: 'basic', width: 10 },
        { header: 'PT Deduction', key: 'ptDed', width: 10 },
        { header: 'Correspondence Address', key: 'corrAddress', width: 30 },
        { header: 'Permanent Address', key: 'permAddress', width: 30 },
        { header: 'Father Name', key: 'FatherName', width: 25 },
        { header: 'Caste', key: 'Caste', width: 15 },
        { header: 'Gender', key: 'Gender', width: 10 },
        { header: 'Birthday', key: 'bDay', width: 15 },
        { header: 'Identity Mark', key: 'IdentityMark', width: 25 },
        { header: 'Known Languages', key: 'KnownLang', width: 25 },
        { header: 'Education', key: 'Education', width: 25 },
        { header: 'Blood Group', key: 'BloodGrp', width: 10 },
        { header: 'Mother Tongue', key: 'Mothertongue', width: 25 }
    ];

    employeeInfo.forEach(emp => {
        worksheet.addRow({
            code: emp.code,
            eName: emp.eName,
            gradCode: emp.gradCode,
            branchCode: emp.branchCode,
            sectCode: emp.sectCode,
            Type: emp.Type,
            joiningDate: emp.joiningDate,
            permDate: emp.permDate,
            basic: emp.basic,
            ptDed: emp.ptDed,
            corrAddress: emp.corrAddress,
            permAddress: emp.permAddress,
            FatherName: emp.FatherName,
            Caste: emp.Caste,
            Gender: emp.Gender,
            bDay: emp.bDay,
            IdentityMark: emp.IdentityMark,
            KnownLang: emp.KnownLang,
            Education: emp.Education,
            BloodGrp: emp.BloodGrp,
            Mothertongue: emp.Mothertongue
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=employeeInfo.xlsx');

    await workbook.xlsx.write(res);
    res.end();
};

module.exports = { generatePDF, generateExcel };
