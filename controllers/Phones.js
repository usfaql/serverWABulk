const PhoneNumber = require('../models/PhoneNumberSchema');
const { createObjectCsvWriter } = require('csv-writer');


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


  const csvWriter = createObjectCsvWriter({
    path: 'phone_numbers.csv',
    header: [
        { id: 'number', title: 'Number' },
        { id: 'country', title: 'Country' }
    ]
  });
  
  const getCountyFromNumber = (number) =>{
      const code = number.split(' ')[0];
      return countryCode[code] || 'Unknown'
  }

const saveNumber = async(req, res) =>{
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
}
 
const getNumberByName = async(req, res) =>{
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
}

const getAllCountry = async(req,res)=>{
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
}
/*
const downloadAllData = async(req,res) =>{
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
}
*/

const downloadAllData = async (req, res) => {
    try {
        // إنشاء دفق الكتابة إلى ملف CSV
        const csvStream = format({ headers: true });
        const writableStream = fs.createWriteStream('phone_numbers.csv');

        // معالجة كتابة البيانات عند الانتهاء
        writableStream.on('finish', () => {
            res.download('phone_numbers.csv');
        });

        csvStream.pipe(writableStream);

        // جلب البيانات على دفعات من قاعدة البيانات
        const batchSize = 10000; // تعيين حجم الدفعة
        let skip = 0;
        let hasMoreData = true;

        while (hasMoreData) {
            const phoneNumbers = await PhoneNumber.find().skip(skip).limit(batchSize);

            if (phoneNumbers.length === 0) {
                hasMoreData = false;
                break;
            }

            // تجميع الأرقام حسب البلد
            const groupedNumbers = phoneNumbers.reduce((acc, { number, country }) => {
                if (!acc[country]) {
                    acc[country] = [];
                }
                acc[country].push(number);
                return acc;
            }, {});

            // كتابة الأرقام إلى CSV
            const maxRows = Math.max(...Object.values(groupedNumbers).map(arr => arr.length));
            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
                const row = {};
                for (const [country, numbers] of Object.entries(groupedNumbers)) {
                    row[country] = numbers[rowIndex] || '';
                }
                csvStream.write(row); // كتابة الصف إلى CSV
            }

            skip += batchSize;
        }

        csvStream.end(); // إنهاء دفق الكتابة

    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).send('Error generating CSV file.');
    }
};
const downloadDataByCountry = async(req,res) => {
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
}

const getCountCountry = async(req, res) =>{
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
}

const checkWhatsApp = async(req,res) =>{
    const { numbers } = req.body;

    if (!Array.isArray(numbers)) {
        return res.status(400).json({ error: 'Numbers must be an array' });
    }
  
    try {
        const results = [];
        for (const number of numbers) {
            const numberWithCountryCode = `${number}@c.us`; 
            const exists = await client.isRegisteredUser(numberWithCountryCode);
            results.push({ number, exists });
        }
        res.json(results);
    } catch (error) {
        console.error('Error checking numbers:', error);
        res.status(500).json({ error: 'Error checking numbers' });
    }
}

module.exports = {
    saveNumber,
    getNumberByName,
    getAllCountry,
    downloadAllData,
    downloadDataByCountry,
    getCountCountry,
    checkWhatsApp
}
