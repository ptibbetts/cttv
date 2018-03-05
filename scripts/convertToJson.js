const xlsxj = require("xlsx-to-json");

xlsxj({
  input: "./src/data/ux-cruise-data.xlsx", 
  output: "./src/data/data.json"
}, (err) => {
  if(err) {
    console.error(err);
  }else {
    console.log('Converted!');
  }
});