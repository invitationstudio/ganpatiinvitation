const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Customer Name : ", (customerName) => {

    const fileName = customerName.trim().toLowerCase();

    if (!fileName) {
        console.log("Customer name is required.");
        rl.close();
        return;
    }

    const customerData = {
        title: "",
        family: "",
        date: "",
        time: "",
        address: "",
        map: "",
        phone: "",
        whatsapp: "",
        eventDate: ""
    };

    const folder = path.join(__dirname, "../data/customers");

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = path.join(folder, `${fileName}.json`);

    if (fs.existsSync(filePath)) {
        console.log("Customer already exists.");
    } else {
        fs.writeFileSync(
            filePath,
            JSON.stringify(customerData, null, 4),
            "utf8"
        );

        console.log(`Created : data/customers/${fileName}.json`);
    }

    rl.close();

});