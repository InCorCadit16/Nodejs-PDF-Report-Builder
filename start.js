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

  let template = requestBody.template;
  template = fillTemplate(template, requestBody.data);

  await page.setContent(template, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({format: 'A4', printBackground: true, pageRanges: '1-3'});
  
  await browser.close();
  return buffer
}

function getTemplate() {
  return new Promise((resolve, reject) => {
    fs.readFile('C:/Users/alexandru.rosca/source/repos/nodejs-pdf-extractor/report.html', {encoding: 'utf-8'}, (err, data) => {
      if (err) 
        reject(err)
      else
        resolve(data)
    })
  })  
}

function fillTemplate(requestBody, collectionPrefix) {

  let template = requestBody.template;
  let data = requestBody.data;

  for (let property in data) {
    if (property.hasOwnProperty('length')) {
      
    } else {
      template = template.replace(`{{${property}}}`, template)
    }
  }

  template = template
    .replace('{{chartImage}}', data.chartImage)
    .replace('{{femaleAndNonbinaryMean}}', data.currency + data.femaleAndNonBinaryMean.toFixed(2))
    .replace("{{maleMean}}", data.currency + data.maleMean.toFixed(2))
    .replace("{{meanPayDifference}}", data.currency + data.meanPayDifference.toFixed(2))
    .replace("{{meanPercentageDifference}}", (data.meanPercentageDifference * 100).toFixed(2))
    .replace("{{impactOnEBIT}}", data.currency + data.impactOnEBIT.toFixed(2))
    .replace("{{nonmaleStuffProportion}}", (data.nonmaleStuffProportion * 100).toFixed(2))
    .replace("{{closingTimeUsual}}", data.closingPayGapUsusal.toFixed())
    .replace("{{closingTimeAccelerated}}", data.closingPayGapAccelerated.toFixed())
    .replace("{{country}}", data.country.name)
    .replace("{{gdpRegionImpact}}", data.currency + data.regionGDPImpact.toFixed(2))
    .replace("{{gdpRegionImpactPercents}}", data.regionGDPImpactPercents.toString())
    .replace("{{gdpGlobalImpact}}", "$" +  data.globalGDPImpact.toFixed(2))
    .replace("{{gdpGlobalImpactPercents}}", data.globalGDPImpactPercents.toString());

  for (let i = 0; i < data.insightItems.length; i++)
  {
    template = template
      .replace(`{{insightTitle${i + 1}}}`, data.insightItems[i].title)
      .replace(`{{insightContent${i + 1}}}`, data.insightItems[i].content);
  }

  return template
}



