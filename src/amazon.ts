let getCurrentPage = () => {
    if (document.getElementById("placeYourOrder"))
        return "PLACE_ORDER";

    if (document.querySelector("form[action*='/hz/audible/checkout'] input[name*='AddCreditCardEvent']"))
        return "ADD_CREDIT_CARD";

    if (document.getElementById("add-to-cart-button") || document.getElementById("one-click-button") || document.getElementById("buy-now-button")
        || document.querySelector("form[action*='/hz/audible/checkout']"))
        return "PRODUCT_PAGE";

    if (document.querySelector('div[data-component-type="s-search-result"]'))
        return "SEARCH_RESULTS";

    if (document.getElementById('sw-ptc-form'))
        return "CART";

    if (document.getElementById("authportal-center-section"))
        return "LOGIN_REQUESTED";

    if (document.querySelector("img[src*='checkout']") || document.getElementById("checkoutOrderSummaryDesktopBox"))
        return "CHECKOUT";
}

(() => {
    try {
        switch (getCurrentPage()) {
            case "SEARCH_RESULTS":
                let firstProduct = document.querySelector('div[data-component-type="s-search-result"]');
                let link = firstProduct.querySelector(".s-product-image-container a.a-link-normal") as HTMLAnchorElement;
                link.click();
                break;
            case "PRODUCT_PAGE":
                let addToCartButton = document.querySelector("#add-to-cart-button") as HTMLElement;
                if (addToCartButton) {
                    addToCartButton.click();
                    break;
                }

                let oneClickButton = document.querySelector("#one-click-button") as HTMLElement;
                if (oneClickButton) {
                    oneClickButton.click();
                    break;
                }

                let butNowButton = document.querySelector("#buy-now-button") as HTMLElement;
                if (butNowButton) {
                    butNowButton.click();
                    break;
                }

                let continueForFreeButton = document.querySelector("form[action*='/hz/audible/checkout'] input[type='submit']") as HTMLElement;
                if (continueForFreeButton) {
                    continueForFreeButton.click();
                }

                break;
            case "CART":
                let checkoutButton = document.querySelector('input[name="proceedToRetailCheckout"]') as HTMLElement;
                checkoutButton.click();
                break;
            case "PLACE_ORDER":
            case "LOGIN_REQUESTED":
            case "CHECKOUT":
                chrome.runtime.sendMessage({ type: "ITEM_ADDED" });
                break;
            case "ADD_CREDIT_CARD":
                chrome.runtime.sendMessage({ type: "CHOOSE_PAYMENT", message: "https://www.amazon.com/gp/buy/payselect/handlers/display.html" });
                break;
            default:
                throw new Error("page not found");
        }
    } catch (err) {
        chrome.runtime.sendMessage({ type: "ERROR_OCCURED", message: err });
    }
})();













