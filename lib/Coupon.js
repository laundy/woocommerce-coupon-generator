class Coupon {
    static _chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    constructor(couponData) {
        if (couponData) {
            this._id = couponData.id;
            this._code = couponData.code;
            this._amount = couponData.amount;
            this._description = couponData.description;
            this._type = couponData.discountType;
        }
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

    static generateCode(charLength, prefix = '', suffix = '', ) {
        let code = '';
        for (var i = 0; i < charLength; i++) {
            code += Coupon._chars.charAt(
                Math.floor(Math.random() * Coupon._chars.length)
            );
        }
        code = prefix + code + suffix;

        return code;
    }
}

module.exports = Coupon;