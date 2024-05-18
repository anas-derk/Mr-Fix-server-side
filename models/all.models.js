// استيراد مكتبة ال mongoose للتعامل مع قاعدة البيانات

const { mongoose } = require("../server");

// تعريف كائن هيكل جدول المستخدمين

const userSchema = new mongoose.Schema({
    firstAndLastName: String,
    email: String,
    mobilePhone: String,
    password: String,
    gender: String,
    birthday: String,
    city: String,
    address: String,
    userType: {
        type: String,
        default: "user",
    },
});

// إنشاء كائت جدول المستخدمين باستخدام الهيكلية السابقة

const userModel = mongoose.model("user", userSchema);

// تعريف كائن هيكل جدول الطلبات

const requestSchema = new mongoose.Schema({
    requestType: String,
    serviceType: String,
    explainAndNewAddress: String,
    preferredDateOfVisit: {
        type: String,
        default: "فوراً",
    },
    preferredTimeOfVisit: {
        type: String,
        default: "فوراً",
    },
    electricityTimes: String,
    isAlternativeEnergyExist: String,
    requestPostDate: {
        type: Date,
        default: Date.now(),
    },
    userId: String,
    files: Array,
});

// إنشاء كائن جدول الطلبات من كائن هيكل الطلبات

const requestModel = mongoose.model("request", requestSchema);

// إنشاء كائن هيكل جدول المسؤولين

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    userType: {
        type: String,
        default: "admin",
    },
});

// إنشاء كائن جدول المسؤولين

const adminModel = mongoose.model("admin", adminSchema);

// إنشاء كائن هيكل جدول الإعلانات

const adsSchema = new mongoose.Schema({
    content: String,
    adsPostDate: {
        type: Date,
        default: Date.now(),
    },
});

// إنشاء كائن جدول الإعلانات

const adsModel = mongoose.model("ad", adsSchema);

module.exports = {
    mongoose,
    userModel,
    requestModel,
    adminModel,
    adsModel,
}