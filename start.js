const puppeteer = require('puppeteer')
const express = require('express')
const bodyParser = require('body-parser')

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(bodyParser.json({
  limit: '50mb'
}))


app.post('/api/pdf', async (req, res) => {
  const pdfReport = await downloadPdf(req.body);
 
  res.setHeader('Content-type', 'application/pdf');
  res.status(200);
  res.end(pdfReport);
})

const port = 3000
app.listen(port, () => {
  console.log(`running on ${port}`)
})

async function downloadPdf(requestBody) {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();

  const content = fillTemplate(requestBody);

  await page.setContent(content, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({format: 'A4', printBackground: true, margin: {top: 0, right: 0, bottom: 0, left: 0}});
  
  await browser.close();
  return buffer;
}

function fillTemplate(requestBody) {
  let template = requestBody.Template;
  let data = requestBody.Data;

  for (let property in data) {
    if (typeof(data[property]) === 'object' && data[property].hasOwnProperty('length')) {
      for (let i = 0; i < data[property].length; i++) {
        if (typeof(data[property][i]) === 'object') {
          for (let subproperty in data[property][i]) {
            template = template.replace(`{{${cutLast(property) + capitalize(subproperty) + (i + 1)}}}`, data[property][i][subproperty]);
          }
        } else {
          template = template.replace(`{{${cutLast(property) + (i + 1)}}}`, data[property][i])
        }
      }
    } else if (typeof(data[property]) === 'object' && !data[property].hasOwnProperty('length')) {
        for (let subproperty in data[property]) {
          template = template.replace(`{{${property + capitalize(subproperty)}}}`, data[property][subproperty]);
        }
    } else {
      template = template.replace(`{{${property}}}`, data[property]);
    }
  }

  return template;
}

function capitalize(value) {
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

function cutLast(value) {
  return value.substring(0, value.length - 1);
}


