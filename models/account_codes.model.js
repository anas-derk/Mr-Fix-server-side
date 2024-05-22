const { accountVerificationCodesModel } = require("../models/all.models");

async function addNewAccountVerificationCode(email, code, typeOfUse) {
    try{
        const creatingDate = new Date(Date.now());
        const expirationDate = new Date(creatingDate.getTime() + 24 * 60 * 60 * 1000);
        const accountVerificationCode = await accountVerificationCodesModel.findOne({ email, typeOfUse });
        if (accountVerificationCode) {
            const newRequestTimeCount = accountVerificationCode.requestTimeCount + 1;
            await accountVerificationCodesModel.updateOne({ email },
                {
                    code,
                    requestTimeCount: newRequestTimeCount,
                    createdDate: creatingDate,
                    expirationDate: expirationDate,
                    isBlockingFromReceiveTheCode: newRequestTimeCount >= 5 ? true: false,
                    receiveBlockingExpirationDate:
                        newRequestTimeCount >=5 ? expirationDate : accountVerificationCode.receiveBlockingExpirationDate,
                }
            );
            return {
                msg: "Sending Code To Your Email Process Has Been Succssfuly !!",
                error: false,
                data: {},
            }
        }
        const newAccountCode = new accountVerificationCodesModel({
            email,
            code,
            createdDate: creatingDate,
            expirationDate: expirationDate,
            typeOfUse
        });
        await newAccountCode.save();
        return {
            msg: "Sending Code To Your Email Process Has Been Succssfuly !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function isAccountVerificationCodeValid(email, code, typeOfUse) {
    try{
        const accountVerificationCode = await accountVerificationCodesModel.findOne({ email, typeOfUse });
        if (accountVerificationCode) {
            if (accountVerificationCode.code === code) {
                return {
                    msg: "عذراً هذا الرمز غير صحيح !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "عذراً هذا الرمز غير صحيح !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "عذراً هذا المستخدم غير موجود !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email) {
    try{
        const accountVerificationCode = await accountVerificationCodesModel.findOne({ email });
        if (accountVerificationCode) {
            const currentDate = new Date(Date.now());
            if (
                accountVerificationCode.isBlockingFromReceiveTheCode &&
                currentDate < accountVerificationCode.receiveBlockingExpirationDate
            ) {
                return {
                    msg: "Sorry, This Email Has Been Blocked From Receiving Code Messages For 24 Hours Due To Exceeding The Maximum Number Of Resend Attempts !!",
                    error: true,
                    data: {
                        receiveBlockingExpirationDate: accountVerificationCode.receiveBlockingExpirationDate,
                    },
                }
            }
        }
        return {
            msg: "Sorry, There Is No Code For This Email !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid,
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
}