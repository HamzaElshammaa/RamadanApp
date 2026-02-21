/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
    type: "widget",
    name: "Ramadan Widget",
    entitlements: {
        "com.apple.security.application-groups": ["group.com.ramadanapp.shared"],
    },
};
