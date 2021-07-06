class Coupon {
    constructor(couponData) {
        this._id = couponData.id;
        this._code = couponData.code;
        this._amount = couponData.amount;
        this._description = couponData.description;
        this._type = couponData.discountType;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get code() {
        return this._code;
    }

    set code(code) {
        this._code = code;
    }

    get amount() {
        return this._amount;
    }

    set amount(amount) {
        this._amount = amount;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    generateCode() {
        return null; // TODO
    }
}

module.exports = Coupon;