import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import config from "./config";

const api = new WooCommerceRestApi({
    url: config.url,
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    version: config.version
});