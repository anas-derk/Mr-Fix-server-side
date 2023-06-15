// import mongoose module for manipulate with mongo database

const mongoose = require("mongoose");

// import Database Url

const DB_URL = require("../global/DB_URL");

// create Admin User Schema For Admin User Model

const adsSchema = mongoose.Schema({
    content: String,
    adsPostDate: {
        type: Date,
        default: Date.now(),
    },
});

// create Ads User Model In Database

const adsModel = mongoose.model("ad", adsSchema);

async function addAds(content) {
    try {
        await mongoose.connect(DB_URL);
        let ads = await adsModel.findOne({ content });
        if (ads) {
            mongoose.disconnect();
            return "عذراً يوجد إعلان سابق بنفس المحتوى تماماً";
        }
        else {
            let newAds = new adsModel({
                content
            });
            await newAds.save();
            mongoose.disconnect();
            return "تهانينا ، لقد تمّ إضافة الإعلان بنجاح";
        }
    } catch(err) {
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllAds() {
    try {
        await mongoose.connect(DB_URL);
        const adsList = await adsModel.find({});
        if (adsList) {
            mongoose.disconnect();
            return adsList;
        }
    } catch(err) {
        mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addAds,
    getAllAds,
}