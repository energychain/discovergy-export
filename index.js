#!/usr/bin/env node

require('dotenv').config()

const fs = require("fs");
const axios = require("axios");
const moment = require("moment");

const { program } = require('commander');

program
  .option('-u --username [discovergy_account]','Discovergy Portal User - Email')
  .option('-p --password [discovergy_password]','Discovergy Portal Password')
  .option('-m --meterId [meterId]','API MeterId (this is not the administration number!)')
  .option('--from [timestamp]','Timestamp start readings with')
  .option('--to [timestamp]','Timestamp to end readings with')
  .option('--resolution [resolution]','Resolution of aggregated data')
  .option('--save [basename]','Save output to filesystem using given basename (if not print on console)')
  .option('--split','Split into seperate files (only with --save option)')
  .option('--format [format]','Output format (eq. csv, json)')
  .option('--fields [fieldlist]','Comma seperated list of fields. If not specified all fields of first meter are used.')
  .option('--all','Retrieve all data of meter (no timeframe). Check resolution option against API limits!');

program.parse();

const options = program.opts();
const args = program.args;

const mergeOptions = function(optionName) {
  let res = null;
  if(typeof process.env[optionName] !== 'undefined') res = process.env[optionName];
  if(typeof options[optionName] !== 'undefined') res = options[optionName];
  return res;
}

let username = mergeOptions('username');
let password = mergeOptions('password');
let meterId = mergeOptions('meterId');
let from = mergeOptions('from');
let to = mergeOptions('to');
let resolution = mergeOptions('resolution');
let format = mergeOptions('format');
let save = mergeOptions('save');
let fields = mergeOptions('fields');
let split = mergeOptions('split');
let all = mergeOptions('all');

const app = async function() {
  const fetcher = async function(url) {
      let responds = await axios.get(url,{
        auth: {
          username: username,
          password: password
        }
      });
      return responds.data;
  }

  const fetchMeter = async function(meterId,meters) {
    if(all) {
      // retrieve first reading
      for(let i=0;i<meters.length;i++) {
        if(meters[i].meterId == meterId) {
          from = meters[i].firstMeasurementTime;
          to = meters[i].lastMeasurementTime;
        }
      }
    }
    if(from == null) {
        from = new Date().getTime()-86400000;
    }
    if(isNaN(from)) {
      from = moment(from).toDate().getTime();
    }
    if(to == null) {
      to = from + 86400000;
    }
    if(isNaN(to)) {
      to = moment(to).toDate().getTime();
    }
    if(resolution == null) {
      resolution = 'fifteen_minutes'
    }
    try {
      let response = await fetcher("https://api.discovergy.com/public/v1/readings?meterId="+meterId+"&from="+from+"&to="+to+"&resolution="+resolution);
      return response;
    } catch(e) {
      console.error(e.response.data);
      process.exit(1);
    }
  }

  const decorateReadings = async function(meterId,readings) {
    for(let i=0;i<readings.length;i++) {
        readings[i].meterId = meterId;
    }
    return readings;
  }

  let outputData = [];

  if(meterId == null) {
    meters = await fetcher("https://api.discovergy.com/public/v1/meters");
    for(let i=0;i<meters.length;i++) {
      let readings = await fetchMeter(meters[i].meterId,meters);
      outputData.push(await decorateReadings(meters[i].meterId,readings));
    }
  } else {
      let readings = await fetchMeter(meterId);
      outputData.push(await decorateReadings(meterId,readings));
  }

  // outputData is now raw readings.

  if(format == null) format='json';
  if(''+save == 'true') save = '';
  if(format == 'json') {
    if(save == null) {
      console.log(JSON.stringify(outputData));
    } else {
      if(split == null) {
        fs.writeFileSync(save + 'export.json',JSON.stringify(outputData));
      } else {
        for(let j=0;j<outputData.length;j++) {
          if(outputData[j].length >0) {
            let meterId = outputData[j][0].meterId;
            fs.writeFileSync(save + '' + meterId+'.json',JSON.stringify(outputData[j]));
          }
        }
      }
    }
  }
  if(format == 'csv') {
      const csvFirstRow = function() {
        let row = '';
        if(outputData.length > 0) {
          row += 'meterId;timestamp;';
          if(fields == null) {
            for (const [key, value] of Object.entries(outputData[0][0].values)) {
                  row += key + ";";
            }
          } else {
            let list = fields.split(',');
            for (let k=0;k<list.length;k++) {
              row += list[k]+";";
            }
          }
          row += '\n';
        }
        return row;
      }

      let rows = '';
      rows += csvFirstRow();
      let meterId = '';

      for(let i =0;i<outputData.length;i++) {
        for(let j=0;j<outputData[i].length;j++) {
          let row = '';
          meterId = outputData[i][j].meterId;
          row += outputData[i][j].meterId + ";";
          row += outputData[i][j].time + ";";
          if(fields == null) {
            for (const [key, value] of Object.entries(outputData[0][0].values)) {
                  row += outputData[i][j].values[key] + ";";
            }
          } else {
            let list = fields.split(',');
            for (let k=0;k<list.length;k++) {
                  row += outputData[i][j].values[list[k]] + ";";
            }
          }
          rows += row + "\n";
        }
        if((save !== null) && (split !== null)) {
            fs.writeFileSync(save + '' + meterId+'.csv',rows);
            rows = '';
            rows += csvFirstRow();
        }
      }
      if(save == null) {
          console.log(rows);
      } else {
          if(split == null) {
            fs.writeFileSync(save + 'export.csv',rows);
          }
      }
  }
}

if((username !== null) && (password !== null)) {
  app();
} else {
  console.error('Specify at lease username and password as arguments or in .env file');
}
