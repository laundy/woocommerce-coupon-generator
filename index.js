const _ = require('lodash');
const fs = require('fs');
const csvParse = require('csv-parse/lib/sync')
const csvStringify = require('csv-stringify')
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const config = require('./config');
const Coupon = require('./lib/Coupon');

/////////////// READ CSV ///////////////

const input = fs.readFileSync(config.filepath);

let importedRecords = csvParse(input, {
    delimiter: config.csvSeparator,
    columns: true,
    skip_empty_lines: true
});

/////////////// GENERATE COUPON CODES ///////////////
let customerRecords = [];
for (let importedRecord of importedRecords) {
    let amount = importedRecord['Sofortrabatt Kasse'];
    let couponSuffix = (amount == 10) ? 'X' : amount;

    customerRecords.push({
        amount: amount,
        customer: importedRecord['Nummer'],
        code: Coupon.generateCode(config.couponLengthWithoutPrefixAndSuffix, config.couponPrefix, couponSuffix)
    });
}

console.log(`Generating ${customerRecords.length} coupons`);

/////////////// INITIALIZE WOOCOMMERCE API ///////////////

const api = new WooCommerceRestApi({
    url: config.url,
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    version: config.version
});

/////////////// CREATE COUPONS IN BATCHES ///////////////
let generatedCoupons = [];

const wooCoupons = customerRecords.map((customerRecord) => {
    return {
        code: customerRecord.code,
        discount_type: "percent",
        amount: customerRecord.amount,
        individual_use: true,
        free_shipping: true,
        usage_limit: 1,
        exclude_sale_items: true,
        minimum_amount: config.couponMinimumAmount,
        meta_data: [{
            key: "customer_number",
            value: customerRecord.customer
        }]
    }
});

const customerRecordChunks = _.chunk(wooCoupons, 100);

for (let customerRecordChunk of customerRecordChunks) {
    const data = {
        create: customerRecordChunk
    }

    api.post("coupons/batch", data)
        .then((response) => {
            for (let createdCoupon of response.data.create) {
                if (createdCoupon.error) {
                    console.error(`Coupon with code ${createdCoupon.code} could not be created.`);
                }
                let coupon = new Coupon(createdCoupon);
                generatedCoupons.push(coupon);
                console.log(`Successfully created coupon ${coupon.code} (${coupon.amount} %) for customer ${coupon.description}`);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

/////////////// WRITE BACK TO CSV ///////////////
const columns = {
    amount: 'Sofortrabatt Kasse',
    customer: 'Nummer',
    code: 'Gutscheincode'
};

csvStringify(customerRecords, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFileSync('export.csv', output, (err) => {
        if (err) throw err;
        console.log('my.csv saved.');
    });
});