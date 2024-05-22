// استيراد مكتبة ال mongoose للتعامل مع قاعدة البيانات

const { mongoose } = require("../server");

// تعريف كائن هيكل جدول المستخدمين

const userSchema = new mongoose.Schema({
    firstAndLastName: {
        type: String,
        required: true,
    },
    email: String,
    mobilePhone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: [
            "male",
            "female"
        ],
    },
    birthday: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        enum: [
            "damascus",
            "rif-damascus"
        ],
    },
    address: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "user",
    },
});

// إنشاء كائت جدول المستخدمين باستخدام الهيكلية السابقة

const userModel = mongoose.model("user", userSchema);

// تعريف كائن هيكل جدول الطلبات

const requestSchema = new mongoose.Schema({
    requestType: {
        type: String,
        required: true,
        enum: [
            "طلب عادي",
            "طلب إسعافي"
        ],
    },
    serviceType: {
        type: String,
        required: true,
        enum: [
            "الكهربائيات والالكترونيات",
            "الصحية ( السباكة )",
            "الطاقة البديلة",
            "الخشبيات والمفروشات",
            "الألمنيوم",
            "دهان وعزل",
            "نقل الأثاث",
            "التنظيف",
            "صيانة المنازل المؤجرة قبل الانتقال إليها",
            "اقتراحات تغيير ديكور واستغلال المساحات",
            "استفسار عن تكلفة الإصلاح"
        ],
    },
    explainAndNewAddress: {
        type: String,
        required: true,
    },
    preferredDateOfVisit: {
        type: String,
        default: "فوراً",
    },
    preferredTimeOfVisit: {
        type: String,
        default: "فوراً",
    },
    electricityTimes: {
        type: String,
        required: true,
    },
    isAlternativeEnergyExist: {
        type: String,
        required: true,
    },
    requestPostDate: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: String,
        required: true,
    },
    files: {
        type: Array,
        required: true,
    },
});

// إنشاء كائن جدول الطلبات من كائن هيكل الطلبات

const requestModel = mongoose.model("request", requestSchema);

// إنشاء كائن هيكل جدول المسؤولين

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "admin",
    },
});

// إنشاء كائن جدول المسؤولين

const adminModel = mongoose.model("admin", adminSchema);

// إنشاء كائن هيكل جدول الإعلانات

const adsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    adsPostDate: {
        type: Date,
        default: Date.now(),
    },
});

// إنشاء كائن جدول الإعلانات

const adsModel = mongoose.model("ad", adsSchema);

// Create Account Verification Codes Schema

const accountVerificationCodesShema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdDate: Date,
    expirationDate: {
        type: Date,
        required: true,
    },
    requestTimeCount: {
        type: Number,
        default: 1,
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false,
    },
    receiveBlockingExpirationDate: Date,
    typeOfUse: {
        type: String,
        default: "to activate account",
        enum: [
            "to activate account",
            "to reset password",
        ],
    }
});

// Create Account Verification Codes Model From Account Codes Schema

const accountVerificationCodesModel = mongoose.model("account_verification_codes", accountVerificationCodesShema);

module.exports = {
    userModel,
    requestModel,
    adminModel,
    adsModel,
    accountVerificationCodesModel
}