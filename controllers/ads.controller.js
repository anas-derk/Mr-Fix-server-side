const { getResponseObject } = require("../global/functions");

const adsOPerationsManagmentFunctions = require("../models/ads.model");

async function postAddAd(req, res) {
    try{
        res.json(await adsOPerationsManagmentFunctions.addNewAd(req.data._id, req.body.content));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAdsCount(req, res) {
    try {
        res.json(await adsOPerationsManagmentFunctions.getAdsCount());
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllAdsInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await adsOPerationsManagmentFunctions.getAllAdsInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteAd(req, res) {
    try{
        res.json(await adsOPerationsManagmentFunctions.deleteAd(req.data._id, req.params.adId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddAd,
    getAdsCount,
    getAllAdsInsideThePage,
    deleteAd
}