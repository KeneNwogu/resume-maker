var fs = require('fs')
var path = require('path')
var json_html = require('resume-to-html');
var pdf = require('html-pdf');
var express = require('express');
var uuidv4 = require('uuid/v4');
const port = process.env.PORT || 3000;
var app = express();
app.use(express.urlencoded({ extended: false }))

app.get('/', (request, response) => {
    response.send('hello world');
});

app.post('/convert', function (req, res) {
    let random = uuidv4();
    let html_name = random + '.html'
    let pdf_name = random + '.pdf'
    let schema = JSON.parse(req.body['schema'])
    if (schema) {
        // console.log(schema);
        json_html(schema, {theme: 'modern'}, function(html, errs){
            console.log(html);
            fs.writeFile(('public/' + html_name), html, () => {
                console.log('done')
            });
            pdf.create(html, {width: '210mm', height: '297mm'}).toFile(('public/' + pdf_name), (err, res) => {
                console.log(res.filename);
                if(err) console.log(err.message);
            });
        });

        res.send({"message": "successful","html": html_name, "pdf": pdf_name});
    }
    else {
        res.json({ "message": 'fail' });
    }
})

app.get('/file/', function(req, res) {
  filename = req.query.filename
  location = 'public/' + filename
  if(filename){
    res.sendFile(path.join(__dirname, location));
  }
  else{
    res.json({'message': 'Invalid query'})
  }
  
})

app.listen(8080, 'localhost', () => {
    console.log('server started');
});

let jsonSchema = `{
    "basics": {
      "name": "John Doe",
      "label": "Programmer",
      "image": "",
      "email": "john@gmail.com",
      "phone": "(912) 555-4321",
      "url": "https://johndoe.com",
      "summary": "A summary of John Doe…",
      "location": {
        "address": "2712 Broadway St",
        "postalCode": "CA 94115",
        "city": "San Francisco",
        "countryCode": "US",
        "region": "California"
      },
      "profiles": [{
        "network": "Twitter",
        "username": "john",
        "url": "https://twitter.com/john"
      }]
    },
    "work": [{
      "name": "Company",
      "position": "President",
      "url": "https://company.com",
      "startDate": "2013-01-01",
      "endDate": "2014-01-01",
      "summary": "Description…",
      "highlights": [
        "Started the company"
      ]
    }],
    "volunteer": [{
      "organization": "Organization",
      "position": "Volunteer",
      "url": "https://organization.com/",
      "startDate": "2012-01-01",
      "endDate": "2013-01-01",
      "summary": "Description…",
      "highlights": [
        "Awarded 'Volunteer of the Month'"
      ]
    }],
    "education": [{
      "institution": "University",
      "url": "https://institution.com/",
      "area": "Software Development",
      "studyType": "Bachelor",
      "startDate": "2011-01-01",
      "endDate": "2013-01-01",
      "score": "4.0",
      "courses": [
        "DB1101 - Basic SQL"
      ]
    }],
    "awards": [{
      "title": "Award",
      "date": "2014-11-01",
      "awarder": "Company",
      "summary": "There is no spoon."
    }],
    "publications": [{
      "name": "Publication",
      "publisher": "Company",
      "releaseDate": "2014-10-01",
      "url": "https://publication.com",
      "summary": "Description…"
    }],
    "skills": [{
      "name": "Web Development",
      "level": "Master",
      "keywords": [
        "HTML",
        "CSS",
        "JavaScript"
      ]
    }],
    "languages": [{
      "language": "English",
      "fluency": "Native speaker"
    }],
    "interests": [{
      "name": "Wildlife",
      "keywords": [
        "Ferrets",
        "Unicorns"
      ]
    }],
    "references": [{
      "name": "Jane Doe",
      "reference": "Reference…"
    }],
    "projects": [{
      "name": "Project",
      "description": "Description…",
      "highlights": [
        "Won award at AIHacks 2016"
      ],
      "keywords": [
        "HTML"
      ],
      "startDate": "2019-01-01",
      "endDate": "2021-01-01",
      "url": "https://project.com/",
      "roles": [
        "Team Lead"
      ],
      "entity": "Entity",
      "type": "application"
    }]
}`

// json_html(jsonSchema, {}, (resume) => {
//     console.log(resume);
// })

// htmlFromJson()