const puppeteer = require('puppeteer')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const content = fillTemplate(requestBody);

  await page.setContent(content, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({format: 'A4', printBackground: true, pageRanges: '1-3'});
  
  await browser.close();
  return buffer;
}

function fillTemplate(requestBody) {

  let template = requestBody.template;
  let data = requestBody.data;

  for (let property in data) {
    console.log(data)
    if (typeof(data[property]) === 'object' && data[property].hasOwnProperty('length')) {
      for (let i = 0; i < data[property].length; i++) {
        if (typeof(data[property][i] === 'object')) {
          for (let subproperty in data[property][i]) 
            template = template.replace(`{{${cutLast(property) + capitalize(subproperty) + (i + 1)}}}`, data[property][i][subproperty]);
        } else {
          template = template.replace(`{{${cutLast(property) + (i + 1)}}}`, data[property][i])
        }
      }
    } else if (typeof(data[property]) === 'object' && !data[property].hasOwnProperty('length')) {
        for (let subproperty in data[property][i]) 
          template = template.replace(`{{${cutLast(property) + capitalize(subproperty)}}}`, data[property][i][subproperty]);
    } else {
      template = template.replace(`{{${property}}}`, data[property]);
    }
  }

  return template;
}

function capitalize(value) {
  return value.charAt(0) + value.substring(1);
}

function cutLast(value) {
  return value.substring(0, value.length - 2);
}


