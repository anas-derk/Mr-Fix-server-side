const { getResponseObject } = require("../global/functions");

const adsOPerationsManagmentFunctions = require("../models/ads.model");

async function postAddAd(req, res) {
    try{
        // في حالة تمّ إرسال محتوى الإعلان فإننا نقوم بحفظ الإعلان في قاعدة البيانات
        res.json(await adsOPerationsManagmentFunctions.addNewAd(req.body.content));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllAds(req, res) {
    try{
        res.json(await adsOPerationsManagmentFunctions.getAllAds());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteAd(req, res) {
    try{
        res.json(await adsOPerationsManagmentFunctions.deleteAd(req.params.adId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddAd,
    getAllAds,
    deleteAd
}