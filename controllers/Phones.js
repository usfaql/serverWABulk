const PhoneNumber = require('../models/PhoneNumberSchema');
const { createObjectCsvWriter } = require('csv-writer');
const { format } = require('@fast-csv/format');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://usfaqll:lhCZp7Feyrs8kW74@cluster0.drkzmdw.mongodb.net/phoneNumberDB'; // Your MongoDB connection URL
const client = new MongoClient(url);

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

  const countryMap = {
    arabic_countries: [
      "Algeria",
      "Western-Sahara",
      "Morocco",
      "Tunisia",
      "Libya",
      "Yemen",
      "Syria",
      "Lebanon",
      "Jordan",
      "Palestine",
      "Israel",
      "Iraq",
      "Saudi-Arabia",
      "UAE",
      "Kuwait",
      "Qatar",
      "Oman",
      "Bahrain",
      "Egypt",
      "Sudan",
      "South-Sudan"
  ], 
    asian_countries: [
      "China",
      "Singapore",
      "Malaysia",
      "Indonesia",
      "Iran",
      "Afghanistan",
      "Vietnam",
      "South-Korea",
      "Japan",
      "Tajikistan",
      "Pakistan",
      "Australia",
      "Brunei",
      "Tonga",
      "Cook-Islands",
      "Tokelau",
      "Sri-Lanka",
      "Nepal",
      "India",
      "Bangladesh",
      "Nigeria",
      "Zambia",
      "Cameroon",
      "Ethiopia",
      "Tanzania",
      "Mozambique",
      "Mauritius",
      "Sierra-Leone",
      "Zimbabwe",
      "Lesotho",
      "Botswana",
      "Eswatini",
      "New-Zealand",
      "Macau",
      "Malawi",
      "Angola",
      "Gambia",
      "Guinea",
      "Niger",
      "Republic-of-the-Congo",
      "Madagascar",
      "East Timor",
      "Maldives",
      "Benin",
      "Laos",
      "Rwanda",
      "Burundi",
      "Namibia",
      "Saint-Helena",
      "Azerbaijan",
      "Burkina-Faso",
      "Equatorial-Guinea",
      "Slovakia",
      "Romania",
      "Gabon",
      "Central-African-Republic",
      "Peru",
      "Hungary",
      "Taiwan",
      "Myanmar",
      "Djibouti",
      "Cambodia",
      "Mongolia",
      "Cuba",
      "Czech-Republic",
      "Seychelles",
      "Guinea-Bissau",
      "Uzbekistan"
  ], 
    european_countries: [
      "Iceland",
      "Belgium",
      "Switzerland",
      "France",
      "Germany",
      "Luxembourg",
      "Italy",
      "San-Marino",
      "Vatican",
      "Spain",
      "Andorra",
      "Bulgaria",
      "Gibraltar",
      "Ireland",
      "Albania",
      "Malta",
      "Netherlands",
      "Poland",
      "Belarus",
      "Kyrgyzstan",
      "Ukraine",
      "Serbia",
      "Montenegro",
      "Kosovo",
      "Croatia",
      "Slovenia",
      "Bosnia-and-Herzegovina",
      "North-Macedonia",
      "Moldova",
      "Greece",
      "Cyprus",
      "Lithuania",
      "Latvia",
      "Estonia",
      "Finland",
      "Norway",
      "Sweden",
      "Denmark",
      "United-Kingdom",
      "Austria",
      "Slovakia",
      "Romania",
      "Hungary",
      "Czech-Republic"
  ], 
    african_countries: [
      "Ivory-Coast",
      "Senegal",
      "Mali",
      "Kenya",
      "Democratic-Republic-of-the-Congo",
      "Togo",
      "Liberia",
      "Ghana",
      "South-Africa",
      "Uganda",
      "Réunion",
      "Somalia",
      "Rwanda",
      "Burundi",
      "Namibia",
      "Mauritius",
      "Sierra-Leone",
      "Zimbabwe",
      "Lesotho",
      "Botswana",
      "Eswatini",
      "Cameroon",
      "Ethiopia",
      "Tanzania",
      "Mozambique",
      "Benin",
      "Burkina-Faso",
      "Equatorial-Guinea",
      "Republic-of-the-Congo",
      "Madagascar",
      "Angola",
      "Guinea-Bissau"
  ], 
    american_countries: [
      "United-States-and-Canada",
      "Belize",
      "Guatemala",
      "El-Salvador",
      "Honduras",
      "Nicaragua",
      "Costa-Rica",
      "Panama",
      "Haiti",
      "Guadeloupe",
      "Martinique",
      "Dutch-Caribbean",
      "Mexico",
      "Argentina",
      "Brazil",
      "Portugal",
      "Chile",
      "Colombia",
      "Venezuela",
      "Bolivia",
      "Guyana",
      "Ecuador",
      "French-Guiana",
      "Paraguay",
      "Suriname",
      "Uruguay"
  ]
};

/*
const insertNumber = async (number, country) => {
    try {
        await client.connect();
        const db = client.db('phoneNumberDB');
        
        let collection;
        for (const [category, countries] of Object.entries(countryMap)) {
            if (countries.includes(country)) {
                collection = db.collection(category);
                break;
            }
        }

        if (collection) {
            await collection.insertOne({ number, country });
        } else {
            console.log('Country not found in any category');
        }
    } finally {
        await client.close();
    }
};

const saveNumber = async (req, res) => {
  try {
      const phoneNumbers = req.body.numbers;

      // استعلام للعثور على الأرقام الموجودة مسبقًا
      const existingNumbers = await PhoneNumber.find({ number: { $in: phoneNumbers } });
      const existingNumberSet = new Set(existingNumbers.map(entry => entry.number));

      // تصفية الأرقام الجديدة
      const uniqueNumbers = phoneNumbers
          .filter(number => !existingNumberSet.has(number))
          .map(number => ({
              number,
              country: getCountyFromNumber(number)
          }));

      const duplicateCount = phoneNumbers.length - uniqueNumbers.length; // حساب عدد الأرقام المكررة

      if (uniqueNumbers.length > 0) {
          // إدخال الأرقام الجديدة في المجموعات المناسبة
          for (const { number, country } of uniqueNumbers) {
              // إضافة الرقم إلى قاعدة البيانات أولاً
              await PhoneNumber.create({ number, country });

              // إدخال الرقم في الفئة المناسبة بناءً على البلد
              await insertNumber(number, country);
          }

          // حساب الأعداد حسب البلد
          const countsByCountry = uniqueNumbers.reduce((acc, { country }) => {
              acc[country] = (acc[country] || 0) + 1;
              return acc;
          }, {});

          // ارسال تحديث عدد الأرقام عبر الـ WebSocket
          // io.emit('newNumbersSummary', countsByCountry);

          res.status(200).json({
              status: true,
              message: 'Successfully added data to DB',
              addedNumbers: uniqueNumbers,
              skippedDuplicates: duplicateCount
          });
      } else {
          res.status(302).json({
              status: true,
              message: `No new numbers added. All ${duplicateCount} numbers were duplicates.`,
              addedNumbers: [],
              skippedDuplicates: duplicateCount
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
};
*/


const insertNumbers = async (numbers) => {
  try {
      await client.connect();
      const db = client.db('phoneNumberDB');

      // جمع العمليات للـ bulkWrite
      const operations = {};

      // تصنيف الأرقام حسب الفئات
      for (const { number, country } of numbers) {
          let collection;
          for (const [category, countries] of Object.entries(countryMap)) {
              if (countries.includes(country)) {
                  collection = category;
                  break;
              }
          }

          if (collection) {
              if (!operations[collection]) {
                  operations[collection] = [];
              }
              operations[collection].push({
                  insertOne: {
                      document: { number, country }
                  }
              });
          } else {
              console.log('Country not found in any category');
          }
      }

      // تنفيذ العمليات في المجموعات المناسبة
      await Promise.all(Object.entries(operations).map(async ([category, ops]) => {
          const collection = db.collection(category);
          await collection.bulkWrite(ops);
      }));
  } finally {
      await client.close();
  }
};

const saveNumber = async (req, res) => {
  try {
      const phoneNumbers = req.body.numbers;

      // استعلام للعثور على الأرقام الموجودة مسبقًا
      const existingNumbers = await PhoneNumber.find({ number: { $in: phoneNumbers } });
      const existingNumberSet = new Set(existingNumbers.map(entry => entry.number));

      // تصفية الأرقام الجديدة
      const uniqueNumbers = phoneNumbers
          .filter(number => !existingNumberSet.has(number))
          .map(number => ({
              number,
              country: getCountyFromNumber(number)
          }));

      const duplicateCount = phoneNumbers.length - uniqueNumbers.length; // حساب عدد الأرقام المكررة

      if (uniqueNumbers.length > 0) {
          // إضافة الأرقام الجديدة إلى قاعدة بيانات PhoneNumber بشكل جماعي
          await PhoneNumber.insertMany(uniqueNumbers);

          // إدخال الأرقام في المجموعات المناسبة
          await insertNumbers(uniqueNumbers);

          // حساب الأعداد حسب البلد
          const countsByCountry = uniqueNumbers.reduce((acc, { country }) => {
              acc[country] = (acc[country] || 0) + 1;
              return acc;
          }, {});

          // ارسال تحديث عدد الأرقام عبر الـ WebSocket
          // io.emit('newNumbersSummary', countsByCountry);

          res.status(200).json({
              status: true,
              message: 'Successfully added data to DB',
              addedNumbers: uniqueNumbers,
              skippedDuplicates: duplicateCount
          });
      } else {
          res.status(302).json({
              status: true,
              message: `No new numbers added. All ${duplicateCount} numbers were duplicates.`,
              addedNumbers: [],
              skippedDuplicates: duplicateCount
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
};


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
/*
const getNumberByCollection = async (req, res) => {
  const { collectionName } = req.body; // استقبال collectionName من الطلب

    if (!collectionName) {
        return res.status(400).json({
            status: false,
            message: 'Collection name is missing'
        });
    }

    try {
        // الاتصال بقاعدة البيانات
        await client.connect();
        const db = client.db('phoneNumberDB'); // استبدل phoneNumberDB باسم قاعدة البيانات الخاصة بك

        // التأكد من وجود اسم المجموعة
        if (!db.collection(collectionName)) {
            return res.status(404).json({
                status: false,
                message: `Collection ${collectionName} not found`
            });
        }

        // جلب المجموعة المطلوبة
        const collection = db.collection(collectionName);
        const aggregationPipeline = [
          {
            $group: {
                _id: "$country", // تجميع الأرقام حسب البلد
                numbers: { $push: "$number" }, // دفع الأرقام في مصفوفة لكل بلد
                totalCount: { $sum: 1 } // حساب العدد الإجمالي للأرقام في كل مجموعة
            }
        },
        {
            $sort: { _id: 1 } // ترتيب الدول أبجدياً (حسب _id وهو البلد هنا)
        },
        {
            $group: {
                _id: null, // تجميع النتائج في مجموعة واحدة
                countries: { $push: { country: "$_id", numbers: "$numbers", count: "$totalCount" } }, // إدراج المعلومات الخاصة بكل بلد
                totalNumbers: { $sum: "$totalCount" } // حساب العدد الإجمالي لجميع الأرقام
            }
        },
        {
            $project: {
                _id: 0, // إخفاء الحقل _id
                countries: 1, // إظهار قائمة الدول مع الأرقام وعدد الأرقام
                totalNumbers: 1 // إظهار العدد الإجمالي لجميع الأرقام
            }
        }
      ];
        // جلب الأرقام من المجموعة
        const numbers = await collection.aggregate(aggregationPipeline).toArray();

        if (numbers.length > 0) {
            res.status(200).json({
                status: true,
                message: `Found ${numbers.length} numbers in collection: ${collectionName}`,
                data: numbers
            });
        } else {
            res.status(404).json({
                status: false,
                message: `No numbers found in collection: ${collectionName}`
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error fetching data',
            error: error.message
        });
    } finally {
        await client.close(); // تأكد من إغلاق الاتصال بعد الانتهاء
    }
};
*/


/*
last code
const getNumberByCollection = async (req, res) => {
  const { collectionName, page = 1 } = req.body;

  if (!collectionName) {
    return res.status(400).json({
      status: false,
      message: 'Collection name is missing'
    });
  }

  try {
    await client.connect();
    const db = client.db('phoneNumberDB');
    const collection = db.collection(collectionName);

    const PAGE_SIZE = 200;
    const SKIP = (page - 1) * PAGE_SIZE;

    const aggregationPipeline = [
      {
        $group: {
          _id: "$country",
          numbers: { $push: "$number" },
          totalCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          country: "$_id",
          numbers: { $slice: ["$numbers", SKIP, PAGE_SIZE] },
          _id: 0
        }
      }
    ];

    const numbers = await collection.aggregate(aggregationPipeline).toArray();

    if (numbers.length > 0) {
      res.status(200).json({
        status: true,
        message: `Found ${numbers.length} numbers in collection: ${collectionName}`,
        data: numbers
      });
    } else {
      res.status(404).json({
        status: false,
        message: `No numbers found in collection: ${collectionName}`
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching data',
      error: error.message
    });
  } finally {
    await client.close();
  }
};
*/

const getNumberByCollection = async (req, res) => {
  const { collectionName, country, page = 1 } = req.body;

  if (!collectionName) {
    return res.status(400).json({
      status: false,
      message: 'Collection name is missing'
    });
  }

  try {
    await client.connect();
    const db = client.db('phoneNumberDB');
    const collection = db.collection(collectionName);

    const PAGE_SIZE = 200;
    const SKIP = (page - 1) * PAGE_SIZE;

    const aggregationPipeline = [
      ...(country ? [{ $match: { country } }] : []),
      { $group: { _id: "$country", numbers: { $push: "$number" }, totalCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { country: "$_id", numbers: { $slice: ["$numbers", SKIP, PAGE_SIZE] }, totalCount: 1,_id: 0 } }
    ];

    const numbers = await collection.aggregate(aggregationPipeline).toArray();
    console.log(numbers[0].numbers.length);
    
    if (numbers.length > 0) {
      res.status(200).json({
        status: true,
        message: `Found ${numbers.length} numbers in collection: ${collectionName}` + (country ? ` for country: ${country}` : ''),
        data: numbers,
        count: numbers.length
      });
    } else {
      res.status(404).json({
        status: false,
        message: `No numbers found in collection: ${collectionName}` + (country ? ` for country: ${country}` : '')
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching data',
      error: error.message
    });
  } finally {
    await client.close();
  }
};



const getAllNumberByAllCountry = async (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'));
    const numbers = JSON.parse(data);
    res.status(200).json({
        status: true,
        message: 'Data retrieved successfully',
        data: numbers
    });
} catch (error) {
    res.status(500).json({
        status: false,
        message: 'Error reading data file',
        error: error.message
    });
}
};


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
      const phoneNumbers = await PhoneNumber.find();
      const groupedNumbers = phoneNumbers.reduce((acc, { number, country }) => {
          if (!acc[country]) {
              acc[country] = [];
          }
          acc[country].push(number);
          return acc;
      }, {});

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('PhoneNumbers');

      // Set headers
      const headers = Object.keys(groupedNumbers);
      worksheet.addRow(headers);

      // Find maximum number of rows needed
      const maxRows = Math.max(...Object.values(groupedNumbers).map(arr => arr.length));
      
      // Fill rows
      for (let i = 0; i < maxRows; i++) {
          const row = headers.map(header => groupedNumbers[header][i] || '');
          worksheet.addRow(row);
      }

      // Write the file
      const filePath = 'phone_numbers.xlsx';
      await workbook.xlsx.writeFile(filePath);
      
      // Send the file to the client
      res.download(filePath, (err) => {
          if (err) {
              console.error('Error sending file:', err);
              res.status(500).send('Error sending file.');
          }
          // Optionally, remove the file after sending it
          fs.unlinkSync(filePath);
      });

  } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file.');
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


module.exports = {
    saveNumber,
    getNumberByName,
    getAllCountry,
    downloadAllData,
    downloadDataByCountry,
    getCountCountry,
    getAllNumberByAllCountry,
    getNumberByCollection
    //checkWhatsApp,
    //getQrCode,
    //client
}
