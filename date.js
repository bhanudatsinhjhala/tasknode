module.exports.getDate = function() {
    let today = new Date();
    let currentDay = today.getDay();
    let kindOfDate = "";
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    kindOfDate = today.toLocaleDateString("en-US", options);
    return kindOfDate;
}
module.exports.getDay = function() {
    let today = new Date();
    let currentDay = today.getDay();
    let kindOfDay = "";
    let options = {
        weekday: "long"
    }
    kindOfDay = today.toLocaleDateString("en-US", options);
    return kindOfDay;
}