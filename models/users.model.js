// استيراد كائن ال userModel

const { userModel, adminModel } = require("./all.models");

// استيراد مكتبة تشفير كلمة المرور

const { compare, hash } = require("bcryptjs");

// تعريف دالة إنشاء حساب مستخدم جديد

async function createNewUser(userInfo) {
    try {
        let user;
        // التحقق فيما إذا كان الإيميل قد تمّ إرساله أم لا
        if (userInfo.email.length === 0) {
            // التحقق من أنّ رقم الموبايل موجود
            user = await userModel.findOne({ mobilePhone: userInfo.mobilePhone });
        } else {
            // إذا تم إرسال الإيميل وكلمة المرور بالتالي نتحقق من كون هذا المستخدم موجود مسبقاً
            user = await userModel.findOne({
                $or: [
                    {
                        email: userInfo.email,
                    },
                    {
                        mobilePhone: userInfo.mobilePhone,
                    }
                ]
            });
        }
        // التحقق من أنّ المستخدم موجود بعد البحث عنه في قاعدة البيانات
        if (user) {
            return {
                msg: "عذراً لا يمكن إنشاء الحساب لأنه موجود مسبقاً !!",
                error: true,
                data: {}
            };
        }
        // تشفير كلمة المرور بما أنّ المستخدم غير موجود مسبقاً
        const encrypted_password = await hash(userInfo.password, 10);
        // إنشاء مستخدم جديد في جدول المستخدمين
        const newUser = new userModel({
            firstAndLastName: userInfo.firstAndLastName,
            email: userInfo.email,
            mobilePhone: userInfo.mobilePhone,
            password: encrypted_password,
            gender: userInfo.gender,
            birthday: userInfo.birthday,
            city: userInfo.city,
            address: userInfo.address,
        });
        // حفظ المستخدم الجديد في جدول المستخدمين
        await newUser.save();
        return {
            msg: "تم بنجاح إنشاء الحساب",
            error: false,
            data: {}
        }
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function isUserAccountExist(email) {
    try {
        // التحقق من أن المستخدم موجود في جدول المستخدمين
        const user = await userModel.findOne({ email });
        if (user) {
            // في حالة كان موجوداً ، نقطع الاتصال بقاعدة البيانات ونعيد بيانات هذا المستخدم المطلوبة فقط
            return {
                msg: "عملية  التحقق من وجود الحساب تمت بنجاح !!",
                error: false,
                data: {
                    userId: user._id,
                    userType: "user"
                }
            }
        }
        // في حالة لم يكن موجوداً في جدول المستخدمين عندها نبحث في جدول المسؤولين
        const admin = await userModel.findOne({ email });
        if (admin) {
            // في حالة كان موجوداً ، نقطع الاتصال بقاعدة البيانات ونعيد بيانات هذا المستخدم المطلوبة فقط
            return {
                msg: "عملية  التحقق من وجود الحساب تمت بنجاح !!",
                error: false,
                data: {
                    userId: admin._id,
                    userType: "admin"
                }
            }
        }
        // في حالة لم يكن موجوداً في جدول المسؤولين عندها نعيد false للدلالة أنّ المستخدم غير موجود نهائياً
        return {
            msg: "عذراً ، هذا الحساب غير موجود !!",
            error: true,
            data: {}
        };
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function login(text, password) {
    try {
        // التحقق من كون الحساب موجود في قاعدة البيانات أم لا عن طريق البحث عن إيميل مطابق أو رقم هاتف مطابق
        const user = await userModel.findOne({
            $or: [
                {
                    email: text
                },
                {
                    mobilePhone: text
                }
            ]
        });
        // التحقق من كون يوجد مستخدم فعلياً أي يوجد كائن يحوي بيانات المستخدم
        if (user) {
            // التحقق من كلمة السر صحيحة أم لا لأنّ المستخدم موجود
            const isTruePassword = await compare(password, user.password);
            // في حالة كلمة السر صحيحة نعيد معرّف المستخدم أو نعيد رسالة خطأ في حالة لم تكن صحيحة
            if (isTruePassword) {
                return {
                    msg: "عملية تسجيل الدخول تمت بنجاح !!",
                    error: false,
                    data: {
                        _id: user._id
                    }
                }
            }
            return {
                msg: "عذراً ، الإيميل أو رقم الهاتف خاطئ أو كلمة السر خاطئة",
                error: true,
                data: {}
            }
        }
        return {
            msg: "عذراً ، الإيميل أو رقم الهاتف خاطئ أو كلمة السر خاطئة",
            error: true,
            data: {}
        }
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getUserInfo(userId) {
    try {
        // التحقق من كون المستخدم موجود في قاعدة البيانات عن طريق معرّفه
        const user = await userModel.findById(userId);
        // قطع الاتصال بقاعدة البيانات وفي حالة كان موجوداً نعيد بيانات وإلا نعيد رسالة خطأ
        if (user) {
            return {
                msg: "عملية جلب بيانات المستخدم تمت بنجاح !!",
                error: false,
                data: user
            }
        }
        return {
            msg: "عذراً ، المستخدم غير موجود",
            error: false,
            data: user
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function updateProfile(userId, newUserData, isSameOfEmail, isSameOfMobilePhone) {
    try {
        let user;
        // التحقق من كون قد تمّ إرسال تفس رقم الموبايل وليس نفس الإيميل من أجل عدم البحث في جدول المستخدمين بواسطة رقم الهاتف لأننا لا نريد تغيير رقم الهاتف الافتراضي
        if (isSameOfEmail === "no" && isSameOfMobilePhone == "yes") {
            // التحقق من أن المستخدم موجود عن طريق البحث في جدول المستخدمين عن إيميل مطابق
            user = await userModel.findOne({ email: newUserData.email });
            if (user) {
                return {
                    msg: "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!",
                    error: true,
                    data: {}
                }
            } else {
                // في حالة لم يكن هنالك إيميل مطابق ، نتأكد من كون كلمة السر قد تمّ إرسالها من أجل تغييرهاأم لا
                if (newUserData.password !== "") {
                    // تشفير كلمة السر
                    const newEncryptedPassword = await hash(newUserData.password, 10);
                    // تعديل البيانات المرسلة فقط أي بدون رقم الهاتف
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        email: newUserData.email.toLowerCase(),
                        password: newEncryptedPassword,
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                }
                else {
                    // تعديل بيانات المستخدم لكن بدون كلمة السر ورقم الهاتف
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        email: newUserData.email.toLowerCase(),
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                }
            }
            // التحقق من أنّ الإيميل نفسه ورقم الموبايل ليس نفسه
        } else if (isSameOfEmail == "yes" && isSameOfMobilePhone == "no") {
            // البحث في جدول المستخدمين عن مستخدم له نفس رقم الموبايل لأنه غير مسموح تكرار رقم الموبايل
            user = await userModel.findOne({ mobilePhone: newUserData.mobilePhone });
            if (user) {
                return {
                    msg: "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!",
                    error: true,
                    data: {}
                };
            } else {
                // التحقق من أنّ السر غير مرسلة كي لا يتم تعديلها مع بيانات المستخدم
                if (newUserData.password !== "") {
                    // تشفير كلمة السر
                    const newEncryptedPassword = await hash(newUserData.password, 10);
                    // تعديل بيانات المستخدم بدون الإيميل
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        mobilePhone: newUserData.mobilePhone,
                        password: newEncryptedPassword,
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                } else {
                    // تعديل بيانات المستخدم بدون الإيميل وكلمة السر
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        mobilePhone: newUserData.mobilePhone,
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                }
            }
        // التحقق من أنّ الإيميل ورقم الهاتف ليس نفسه
        } else if (isSameOfEmail == "no" && isSameOfMobilePhone == "no") {
            // البحث في جدول المستخدمين عن مستخدم له إيميل أو رقم هاتف مطابق
            user = await userModel.findOne({
                $or: [
                    {
                        email: newUserData.email
                    },
                    {
                        mobilePhone: newUserData.mobilePhone,
                    }
                ]
            });
            if (user) {
                return {
                    msg: "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!",
                    error: true,
                    data: {}
                };
            } else {
                // التحقق من أنّ كلمة السر قد تمّ إرسالها من أجل تغييرها مع بيانات المستخدم
                if (newUserData.password !== "") {
                    // تشفير كلمة السر
                    const newEncryptedPassword = await hash(newUserData.password, 10);
                    // تعديل بيانات المستخدم كاملة
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        email: newUserData.email,
                        mobilePhone: newUserData.mobilePhone,
                        password: newEncryptedPassword,
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                } else {
                    // تعديل بيانات المستخدم كاملة بدون كلمة السر
                    await userModel.updateOne({ _id: userId }, {
                        firstAndLastName: newUserData.firstAndLastName,
                        email: newUserData.email,
                        mobilePhone: newUserData.mobilePhone,
                        gender: newUserData.gender,
                        birthday: newUserData.birthday,
                        city: newUserData.city,
                        address: newUserData.address,
                    });
                    return {
                        msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                        error: false,
                        data: {}
                    }
                }
            }
            // في حالة لم تكن من ضمن الاحتمالات السابقة أي لم يتم تعديل لا اإيميل ولا رقم الهاتف
        } else {
            // التحقق من أنّه قد تمّ إرسال كلمة السر لتعديلها
            if (newUserData.password !== "") {
                // تشفير كلمة السر
                const newEncryptedPassword = await hash(newUserData.password, 10);
                // تعديل بيانات السمتخدم بدون الإيميل أو رقم الموبايل
                await userModel.updateOne({ _id: userId }, {
                    firstAndLastName: newUserData.firstAndLastName,
                    password: newEncryptedPassword,
                    gender: newUserData.gender,
                    birthday: newUserData.birthday,
                    city: newUserData.city,
                    address: newUserData.address,
                });
                return {
                    msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                    error: false,
                    data: {}
                }
            } else {
                // تعديل بيانات المستخدم بدون الإيميل و رقم الموبايل وكلمة السر
                await userModel.updateOne({ _id: userId }, {
                    firstAndLastName: newUserData.firstAndLastName,
                    gender: newUserData.gender,
                    birthday: newUserData.birthday,
                    city: newUserData.city,
                    address: newUserData.address,
                });
                return {
                    msg: "عملية تحديث بيانات المستخدم تمت بنجاح !!",
                    error: false,
                    data: {}
                }
            }
        }
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function resetUserPassword(email, newPassword, userType) {
    try {
        // تشفير كلمة السر
        const newEncryptedPassword = await hash(newPassword, 10);
        // التحقق من كون نوع المستخدم هو مستخدم عادي
        if (userType == "user") {
            // إعادة تعيين كلمة السر من خلال تعديل بيانات المستخدم في جدول المستخدمين ومن ثمّ إعادة رسالة نجاح
            await userModel.updateOne({ email }, { password: newEncryptedPassword });
            return {
                msg: "لقد تمّت عملية إعادة تعيين كلمة المرور الخاصة بك بنجاح !!",
                error: false,
                data: {}
            }
        }
        // إعادة تعيين كلمة السر من خلال تعديل بيانات المستخدم في جدول المسؤولين في حالة لم يكن مستخدم عادي ومن ثمّ إعادة رسالة نجاح
        await adminModel.updateOne({ email }, { password: newEncryptedPassword });
        return {
            msg: "لقد تمّت عملية إعادة تعيين كلمة المرور الخاصة بك بنجاح !!",
            error: false,
            data: {}
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

// تصدير الدوال المُعرّفة
module.exports = {
    createNewUser,
    login,
    getUserInfo,
    updateProfile,
    isUserAccountExist,
    resetUserPassword,
}