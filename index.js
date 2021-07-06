const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const config = require('./config');
const Coupon = require('./lib/Coupon');

const api = new WooCommerceRestApi({
    url: config.url,
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    version: config.version
});

const data = {
    create: [{
        code: "20off",
        discount_type: "percent",
        amount: "20",
        individual_use: true,
        exclude_sale_items: true,
        minimum_amount: "100.00"
    }],
    update: [],
    delete: []
};

let generatedCoupons = [];

api.post("coupons/batch", data)
    .then((response) => {
        for (let createdCoupon of response.data.create) {
            if (createdCoupon.error) {
                // TODO: handle error
                console.error(createdCoupon.error);
            }
            let coupon = new Coupon(createdCoupon);
            generatedCoupons.push(coupon);
            console.log(`Successfully created coupon ${coupon.code} (${coupon.amount} %) for customer ${coupon.description}`);
        }
    })
    .catch((error) => {
        console.log(error);
    });