const request = require('request');
const rp = require('request-promise-native');
const cheerio = require('cheerio');
const fs = require('fs');

const cruiseUrl = 'http://www.cruise.co.uk'; 

// read the json file
const originalFile = fs.readFileSync('./src/data/data.json', 'utf8');
const json = JSON.parse(originalFile);

// defaults
const cruises = [];
let sortedCruises = [];

// find today
// so we can filter out past cruises
const today = new Date();
today.setHours(24, 0, 0, 0); // set today to midnight
const months = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};
json.map(data => {
  const dateAsString = data["Departure Date"].split(', ');
  const [monthName, day] = dateAsString[1].split(' ');
  const month = months[monthName];
  const year = dateAsString[2];
  const date = new Date(year, month - 1, Number(day) - 1); // Date is zero based
  if (date > today) {
    const cruise = data;
    cruise.date = date;
    cruises.push(cruise);
  }
  return true;
});

sortedCruises = cruises.sort((a, b) => a.date > b.date)   

const download = (uri, filename, callback = () => {}) => {
  request.head(uri, (err) => {
    if (err) console.error(err);
    const file = `./${filename}`;
    if (fs.existsSync(file)) return;
    request(uri).pipe(fs.createWriteStream(file)).on('close', callback);
  });
};

const parse = (html, original) => {
  const cruise = {
    id: original.OfferId,
    date: original.date,
    departure: "",
    nights: 0,
    shipName: "",
    lineName: "",
    logo: "",
    itinerary: "",
    prices: {},
    stars: 0,
  };

  const $ = cheerio.load(html);
  /* eslint-disable func-names */
  $('#mainCol2').filter(function() {
    const data = $(this);

    // departure
    const departureWrapper = data.children().find('.text-medium.fl.padding-top-small').text();
    const departureTextArray = departureWrapper.split(',');
    const [ month, day ] = departureTextArray[0].trim().split(' ');
    const [ year, nights ] = departureTextArray[1].trim().split(' ');
    cruise.departure = `${day}, ${month}, ${year}`;

    // nights
    cruise.nights = nights;
    
    // cruise ship name
    const shipName = data.children().find('.text-center.text-large.bold.fl').text();
    cruise.shipName = shipName;
    
    // cruise line name
    const statistics = data.children().find('#extra-statistics');
    const statisticsChildren = statistics.children().find('.text.bold');
    let lineName;

    statisticsChildren.each((index, element) => {
      if ($(element).text() === 'Ship Cruise Line:') {
        lineName = $(element).next().text().trim();
        return false;
      }
    })
    
    cruise.lineName = lineName;

    // cruise line logo
    const imagePath = data.children().find('.center-text.grid-19 img').attr('src');
    const uri = `${cruiseUrl}/${imagePath}`;
    const imagePathArray = imagePath.split('/');
    const image = imagePathArray[imagePathArray.length - 1];
    download(uri, `./public/assets/images/${image}`);

    cruise.logo = image;

    // itinerary
    // isn't on every page
    const itinerary = []; // eslint-disable-line
    if (data.find('#itinerary-overview')) {
      data.children().find('.itineraryPortName').each((index, element) => {
        itinerary.push($(element).text().trim());
      })
      cruise.itinerary = itinerary.join(', ');
    }

    // prices
    const fareDetails = data.children().find('.type-fare-details');
    
    fareDetails.children().each((index, element) => {
      if ($(element).hasClass('cabin-type')) {
        const type = $(element).find('h2').text();
        const value = $(element).next('.fare-details').find('.fare-price .price').first().text();
        cruise.prices[type] = value;
      }
    });
    
    // stars
    const stars = data.children().find('.grid-7.fl.margin-top-medium .fa-star');
    cruise.stars = stars.length;

    return true;
  });

  return cruise;
}

const getCruiseData = (cruise) => {
  const id = cruise.OfferId;
  const url = `${cruiseUrl}/checkAvailability.php?offerId=${id}&DOLIVE=YES&noint=1`;

  return new Promise((resolve, reject) => {
    rp(url)
    .then(html => parse(html, cruise))
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
}

async function main() {
  const newData = [];
  console.log(`Scraping ${sortedCruises.length} cruises…`);
  for (let i = 0; i < sortedCruises.length; i++) {
    const cruise = sortedCruises[i];
    const data = await getCruiseData(cruise)
      .catch(err => console.error(err)); // synchronous so it doesn't crash the server
    if (data) {
      newData.push(data);
    }
    console.log(`${i + 1}/${sortedCruises.length}: ${cruise.OfferId}`)
  }
  fs.writeFile('./public/assets/data/enhanced.json', JSON.stringify(newData), 'utf8', (err) => {
    if (!err) return;
    console.error(err);
  });
}

main();