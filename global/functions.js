function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function isNumber(input) {
    return isNaN(input.value);
}

function transporterObj() {
    const nodemailer = require('nodemailer');
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "mrfix.help@gmail.com",
            pass: "suwtluglgrxpumsb",
        }
    });
    return transporter;
}

function sendCodeToUserEmail(email) {
    // استدعاء مكتبة توليد شيفرة خاصة بإعادة ضبط كلمة السر
    let CodeGenerator = require('node-code-generator');
    let generator = new CodeGenerator();
    // توليد الكود المراد إرساله إلى الإيميل وفق نمط محدد
    let generatedCode = generator.generateCodes("###**#");
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: "mrfix.help@gmail.com",
        to: email,
        subject: "Verification User Account Is Exist ...",
        text: `Your Code Is: ${generatedCode}`,
    };
    return new Promise((resolve, reject) => {
        // إرسال رسالة الكود إلى الإيميل
        transporterObj().sendMail(mailConfigurations, function (error, info) {
            // في حالة حدث خطأ في الإرسال أرجع خطأ
            if (error) reject(error);
            // في حالة لم يحدث خطأ أعد الكود المولد
            resolve(generatedCode);
        });
    });
}

module.exports = {
    isEmail,
    sendCodeToUserEmail,
    isNumber,
}