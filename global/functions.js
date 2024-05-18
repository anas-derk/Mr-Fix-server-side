const { createTransport } = require("nodemailer");

const CodeGenerator = require('node-code-generator');

function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function isNumber(input) {
    return isNaN(input.value);
}

function transporterObj() {
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.BUSSINESS_EMAIL,
            pass: process.env.BUSSINESS_PASSWORD,
        }
    });
    return transporter;
}

function sendCodeToUserEmail(email) {
    // استدعاء مكتبة توليد شيفرة خاصة بإعادة ضبط كلمة السر
    const generator = new CodeGenerator();
    // توليد الكود المراد إرساله إلى الإيميل وفق نمط محدد
    const generatedCode = generator.generateCodes("###**#");
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: process.env.BUSSINESS_EMAIL,
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
    const text = `- request type: ${fullRequestInfo.requestType}\n- service type: ${fullRequestInfo.serviceType}\n- explain And New Address: ${fullRequestInfo.explainAndNewAddress}\n- preferred Date Of Visit: ${fullRequestInfo.preferredDateOfVisit}\n- preferred Time Of Visit: ${fullRequestInfo.preferredTimeOfVisit}\n- electricity Times: ${fullRequestInfo.electricityTimes}\n- is Alternative Energy Exist: ${fullRequestInfo.isAlternativeEnergyExist}\n ====================\n- first And Last Name: ${senderRequestInfo.firstAndLastName}\n- user email: ${senderRequestInfo.email}\n- mobile phone: ${senderRequestInfo.mobilePhone}\n- gender: ${senderRequestInfo.gender}\n- birthday: ${senderRequestInfo.birthday}\n- city: ${senderRequestInfo.city}\n- address: ${senderRequestInfo.address}`;
    let attachments = [];
    for (let i = 0; i < fullRequestInfo.files.length; i++) {
        attachments.push({
            path: fullRequestInfo.files[i],
        });
    }
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: senderRequestInfo.email,
        to: process.env.BUSSINESS_EMAIL,
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