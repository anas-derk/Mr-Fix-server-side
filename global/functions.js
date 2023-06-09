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
        subject: "رسالة التحقق من البريد الالكتروني الخاص بحسابك على موقع مستر فيكس",
        text: `مرحباً بك في خدمة التحقق من أنك صاحب البريد الالكتروني في مستر فيكس \n الكود هو: ${generatedCode}`,
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

function sendEmail(data) {
    const fullRequestInfo = data[0];
    const senderRequestInfo = data[1];
    let text = `- from user email: ${senderRequestInfo.email},\n`;
    let attachments = [];
    for (let i = 0; i < fullRequestInfo.files.length; i++) {
        attachments.push({
            path: fullRequestInfo.files[i],
        });
    }
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: senderRequestInfo.email,
        to: "mrfix.help@gmail.com",
        subject: "New Request",
        text,
        attachments,
    };
    // إرسال البيانات إلى الإيميل وفق الإعدادات السابقة
    transporterObj().sendMail(mailConfigurations, function (error, info) {
        if (error) {
            // إرجاع الخطأ في حالة عدم نجاح عملية الإرسال
            console.log(err);
        }
        else {
            console.log("تم إرسال الإيميل بنجاح");
        };
    });
}

module.exports = {
    isEmail,
    sendCodeToUserEmail,
    isNumber,
    sendEmail,
}