const fs = require("fs");
const path = require("path");

const customersFolder = path.join(__dirname, "../data/customers");
const outputFile = path.join(__dirname, "../data/customers.json");

if (!fs.existsSync(customersFolder)) {
    console.log("Customers folder not found.");
    process.exit();
}

const files = fs.readdirSync(customersFolder);

const customers = [];

files.forEach(file => {

    if (!file.endsWith(".json")) return;

    const filePath = path.join(customersFolder, file);

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    customers.push({

        id: file.replace(".json",""),

        title: data.title || "",

        family: data.family || ""

    });

});

fs.writeFileSync(

    outputFile,

    JSON.stringify(customers, null, 4),

    "utf8"

);

console.log("customers.json generated successfully.");