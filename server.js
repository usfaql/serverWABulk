import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { createObjectCsvWriter } from 'csv-writer';
import http from 'http';
import { Server } from 'socket.io';


mongoose.connect('mongodb+srv://usfaqll:lhCZp7Feyrs8kW74@cluster0.drkzmdw.mongodb.net/phoneNumberDB');

const app = express();
const PORT = 5000;

let changeStream;


app.use(cors({
  origin: 'https://velvety-puppy-66a229.netlify.app/',
  credentials: true
}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: 'https://velvety-puppy-66a229.netlify.app/',
    credentials: true
  }
});

const PhoneNumberSchema = new mongoose.Schema({
    number : String,
    country : String,
    createdAt: { type: Date, default: Date.now }
});
const PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema);
const countryCode = {
  "+213": "Algeria",
  "+290": "Western-Sahara",
  "+212": "Morocco",
  "+216": "Tunisia",
  "+218": "Libya",
  "+354": "Iceland",
  "+222": "Mauritania",
  "+963": "Syria",
  "+961": "Lebanon",
  "+962": "Jordan",
  "+970": "Palestine",
  "+972": "Israel",
  "+964": "Iraq",
  "+966": "Saudi-Arabia",
  "+971": "UAE",
  "+965": "Kuwait",
  "+974": "Qatar",
  "+968": "Oman",
  "+973": "Bahrain",
  "+967": "Yemen",
  "+20": "Egypt",
  "+249": "Sudan",
  "+211": "South-Sudan",
  "+262": "Comoros",
  "+269": "Comoros",
  "+235": "Chad",
  "+90": "Turkey",
  "+32": "Belgium",
  "+41": "Switzerland",
  "+33": "France",
  "+49": "Germany",
  "+352": "Luxembourg",
  "+39": "Italy",
  "+378": "San-Marino",
  "+379": "Vatican",
  "+34": "Spain",
  "+376": "Andorra",
  "+359": "Bulgaria",
  "+350": "Gibraltar",
  "+353": "Ireland",
  "+355": "Albania",
  "+356": "Malta",
  "+31": "Netherlands",
  "+48": "Poland",
  "+375": "Belarus",
  "+996": "Kyrgyzstan",
  "+380": "Ukraine",
  "+381": "Serbia",
  "+382": "Montenegro",
  "+383": "Kosovo",
  "+385": "Croatia",
  "+386": "Slovenia",
  "+387": "Bosnia-and-Herzegovina",
  "+389": "North-Macedonia",
  "+373": "Moldova",
  "+30": "Greece",
  "+357": "Cyprus",
  "+370": "Lithuania",
  "+371": "Latvia",
  "+372": "Estonia",
  "+358": "Finland",
  "+47": "Norway",
  "+46": "Sweden",
  "+45": "Denmark",
  "+44": "United-Kingdom",
  "+1": "United-States-and-Canada",
  "+501": "Belize",
  "+502": "Guatemala",
  "+503": "El-Salvador",
  "+504": "Honduras",
  "+505": "Nicaragua",
  "+506": "Costa-Rica",
  "+507": "Panama",
  "+509": "Haiti",
  "+590": "Guadeloupe",
  "+596": "Martinique",
  "+599": "Dutch-Caribbean",
  "+52": "Mexico",
  "+54": "Argentina",
  "+55": "Brazil",
  "+351": "Portugal",
  "+56": "Chile",
  "+57": "Colombia",
  "+58": "Venezuela",
  "+591": "Bolivia",
  "+592": "Guyana",
  "+593": "Ecuador",
  "+594": "French-Guiana",
  "+595": "Paraguay",
  "+597": "Suriname",
  "+598": "Uruguay",
  "+7": "Russia-and-Kazakhstan",
  "+852": "Hong Kong",
  "+995": "Azerbaijan",
  "+63": "Philippines",
  "+374": "Armenia",
  "+66": "Thailand",
  "+86": "China",
  "+65": "Singapore",
  "+60": "Malaysia",
  "+62": "Indonesia",
  "+98": "Iran",
  "+93": "Afghanistan",
  "+84": "Vietnam",
  "+82": "South-Korea",
  "+81": "Japan",
  "+992": "Tajikistan",
  "+92": "Pakistan",
  "+61": "Australia",
  "+672": "Australian-External-Territories",
  "+674": "Nauru",
  "+675": "Papua-New-Guinea",
  "+677": "Solomon-Islands",
  "+678": "Vanuatu",
  "+679": "Fiji",
  "+680": "Palau",
  "+683": "Niue",
  "+685": "Samoa",
  "+686": "Kiribati",
  "+688": "Tuvalu",
  "+691": "Micronesia",
  "+692": "Marshall-Islands",
  "+681": "Wallis-and-Futuna",
  "+687": "New Caledonia",
  "+689": "French-Polynesia",
  "+673": "Brunei",
  "+676": "Tonga",
  "+682": "Cook-Islands",
  "+690": "Tokelau",
  "+252": "Somalia",
  "+225": "Ivory-Coast",
  "+221": "Senegal",
  "+223": "Mali",
  "+254": "Kenya",
  "+243": "Democratic-Republic-of-the-Congo",
  "+228": "Togo",
  "+231": "Liberia",
  "+233": "Ghana",
  "+27": "South-Africa",
  "+256": "Uganda",
  "+262": "Réunion",
  "+94": "Sri-Lanka",
  "+977": "Nepal",
  "+91": "India",
  "+880": "Bangladesh",
  "+234": "Nigeria",
  "+500": "Falkland-Islands",
  "+260": "Zambia",
  "+237": "Cameroon",
  "+251": "Ethiopia",
  "+255": "Tanzania",
  "+258": "Mozambique",
  "+230": "Mauritius",
  "+232": "Sierra-Leone",
  "+263": "Zimbabwe",
  "+266": "Lesotho",
  "+267": "Botswana",
  "+268": "Eswatini",
  "+642": "New-Zealand",
  "+853": "Macau",
  "+265": "Malawi",
  "+244": "Angola",
  "+43": "Austria",
  "+220": "Gambia",
  "+224": "Guinea",
  "+227": "Niger",
  "+242": "Republic-of-the-Congo",
  "+261": "Madagascar",
  "+670": "East Timor",
  "+960": "Maldives",
  "+229": "Benin",
  "+856": "Laos",
  "+250": "Rwanda",
  "+257": "Burundi",
  "+264": "Namibia",
  "+658": "Saint-Helena",
  "+994": "Azerbaijan",
  "+226": "Burkina-Faso",
  "+240": "Equatorial-Guinea",
  "+421": "Slovakia",
  "+40": "Romania",
  "+241": "Gabon",
  "+236": "Central-African-Republic",
  "+51": "Peru",
  "+36": "Hungary",
  "+886": "Taiwan",
  "+959": "Myanmar",
  "+253": "Djibouti",
  "+855": "Cambodia",
  "+976": "Mongolia",
  "+53": "Cuba",
  "+420": "Czech-Republic",
  "+248": "Seychelles",
  "+245": "Guinea-Bissau",
  "+998": "Uzbekistan"
}

const getCountyFromNumber = (number) =>{
    const code = number.split(' ')[0];
    return countryCode[code] || 'Unknown'
}
/*
app.post('/save-number', async (req, res) => {
    try {
      const phoneNumbers = req.body.numbers; 
      
      const existingNumbers = await PhoneNumber.find({ number: { $in: phoneNumbers } });
      const existingNumberSet = new Set(existingNumbers.map(entry => entry.number));
  
      const uniqueNumbers = phoneNumbers
        .filter(number => !existingNumberSet.has(number))
        .map(number => ({
          number,
          country: getCountyFromNumber(number)
        }));
  
      if (uniqueNumbers.length > 0) {
        const result = await PhoneNumber.insertMany(uniqueNumbers);
        res.status(200).json({
          status: true,
          message: 'Successfully added data to DB',
          addedNumbers: uniqueNumbers,
          result
        });
      } else {
        res.status(302).json({
          status: true,
          message: 'All numbers are already present in the database',
          addedNumbers: []
        });
      }
    } catch (error) {
      console.error('Error saving numbers', error);
      res.status(500).json({
        status: false,
        message: 'Server Error',
        error
      });
    }
  });
*/

app.post('/save-number', async (req, res) => {
  try {
      const phoneNumbers = req.body.numbers;

      const existingNumbers = await PhoneNumber.find({ number: { $in: phoneNumbers } });
      const existingNumberSet = new Set(existingNumbers.map(entry => entry.number));

      const uniqueNumbers = phoneNumbers
          .filter(number => !existingNumberSet.has(number))
          .map(number => ({
              number,
              country: getCountyFromNumber(number)
          }));

      if (uniqueNumbers.length > 0) {
          const result = await PhoneNumber.insertMany(uniqueNumbers);

          const countsByCountry = uniqueNumbers.reduce((acc, { country }) => {
              acc[country] = (acc[country] || 0) + 1;
              return acc;
          }, {});

          io.emit('newNumbersSummary', countsByCountry);

          res.status(200).json({
              status: true,
              message: 'Successfully added data to DB',
              addedNumbers: uniqueNumbers,
              result
          });
      } else {
          res.status(302).json({
              status: true,
              message: 'All numbers are already present in the database',
              addedNumbers: []
          });
      }
  } catch (error) {
      console.error('Error saving numbers', error);
      res.status(500).json({
          status: false,
          message: 'Server Error',
          error
      });
  }
});

  app.get('/getnumberbyname/:country', async (req,res)=>{
    const {country} = req.params

    if(country){
      try {
        const numbers = await PhoneNumber.find({country});

        if(numbers.length > 0){
          res.status(200).json({
            status : true,
            message : `Found ${numbers.length+1} numbers for country : ${country}`,
            data : numbers
          })
        }else {
          res.status(404).json({
            status : false,
            message : `No numbers found for country ${country}`
          });
        }
      } catch (error) {
        res.status(500).json({
          status : false,
          message : `Error fetching data`,
          error : error.message
        })
        
      }
    }else{
      res.status(400).json({
        status : false,
        message : 'Country is missing'
      })
    }
  })

  const csvWriter = createObjectCsvWriter({
    path: 'phone_numbers.csv',
    header: [
        { id: 'number', title: 'Number' },
        { id: 'country', title: 'Country' }
    ]
  });

  app.get('/getallcountry/', async (req,res)=>{


      try {
        const countries = await PhoneNumber.distinct('country');

        if (countries.length > 0) {
          res.status(200).json({
              status: true,
              message: `Found ${countries.length} countries`,
              data: countries
          });
      } else {
          res.status(404).json({
              status: false,
              message: 'No countries found'
          });
      }
    } catch (error) {
      res.status(500).json({
          status: false,
          message: 'Error fetching data',
          error: error.message
      });
    }
  })

  app.get('/download-csv', async (req, res) => {
    try {
        const phoneNumbers = await PhoneNumber.find();
        const groupedNumbers = phoneNumbers.reduce((acc, { number, country }) => {
            if (!acc[country]) {
                acc[country] = [];
            }
            acc[country].push(number);
            return acc;
        }, {});

        const headers = Object.keys(groupedNumbers).map(country => ({
            id: country,
            title: country
        }));

        const maxRows = Math.max(...Object.values(groupedNumbers).map(arr => arr.length));
        const records = Array.from({ length: maxRows }).map((_, rowIndex) => {
            const row = {};
            for (const [country, numbers] of Object.entries(groupedNumbers)) {
                row[country] = numbers[rowIndex] || '';
            }
            return row;
        });

        const csvWriter = createObjectCsvWriter({
            path: 'phone_numbers.csv',
            header: headers
        });

        await csvWriter.writeRecords(records);
        res.download('phone_numbers.csv');
    } catch (error) {
        res.status(500).send('Error generating CSV file.');
    }
});

app.get('/download-csv/:country', async (req, res) => {
  const { country } = req.params;

  try {
      const phoneNumbers = await PhoneNumber.find({ country });

      if (phoneNumbers.length === 0) {
          return res.status(404).send('No data found for the specified country.');
      }

      const groupedNumbers = phoneNumbers.reduce((acc, { number }) => {
          if (!acc[country]) {
              acc[country] = [];
          }
          acc[country].push(number);
          return acc;
      }, {});

      const headers = [{ id: 'number', title: 'Number' }];

      const records = groupedNumbers[country].map(number => ({ number }));

      const csvWriter = createObjectCsvWriter({
          path: `${country}.csv`,
          header: headers
      });

      await csvWriter.writeRecords(records);

      res.download(`${country}.csv`);
  } catch (error) {
      res.status(500).send('Error generating CSV file.');
  }
});

app.get('/getcountcountry', async (req, res) => {
  try {
    const countryData = await PhoneNumber.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 } 
        }
      }
    ]);

    if (countryData.length > 0) {
      const countries = countryData.map(country => ({
        name: country._id,
        numbers: country.count
      }));

      res.status(200).json({
        status: true,
        message: `Found ${countries.length} countries`,
        data: countries
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'No countries found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
