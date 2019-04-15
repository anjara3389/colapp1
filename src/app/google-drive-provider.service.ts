import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import * as google from 'googleapis';
//import 'googleapis';
//var google = require('googleapis');

//var GoogleSpreadsheet = require('google-spreadsheet');
//import * as GoogleSpreadsheet from 'google-spreadsheet';
//import * as async from 'async';
//var async = require('async');

//var doc = new GoogleSpreadsheet('<1ioSUoE0wAPH6hB7Yv1wyrte83V2>');
//var sheet;

//const {google} = require('googleapis');

//var key = require("./service_account.json");


@Injectable({
  providedIn: 'root'
})
export class GoogleDriveProviderService {
  data: any = null;


  constructor(public http: Http) { }

  load(id) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json';
    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          console.log('Raw Data', data);
          this.data = data.feed.entry;

          let returnArray: Array<any> = [];
          if (this.data && this.data.length > 0) {
            this.data.forEach((entry, index) => {
              var obj = {};
              for (let x in entry) {
                if (x.includes('gsx$') && entry[x].$t) {
                  obj[x.split('$')[1]] = entry[x]['$t'];
                  // console.log( x.split('$')[1] + ': ' + entry[x]['$t'] );
                }
              }
              returnArray.push(obj);
            });
          }
          resolve(returnArray);
        });
    });
  }

/*
  writeToSheet(id) {
    //Sheet1 is the name of the my sheet
    // "range":"Sheet1!"+A+":"+C, means column A to C since im writing 3 items


    const jwtClient = new google.auth.JWT(
     // key.client_email,
      null,
      //key.private_key,
      ["https://www.googleapis.com/auth/indexing"],
      null
    );
    //client_Secret ES API KEY
    jwtClient.authorize({
      client_id: 115614114276937478984,
      client_secret: "195f0ad07d8cbaa3a0485966326e884058f474fa",
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }).done(function (data) {
      localStorage.accessToken = data.access_token;
      localStorage.refreshToken = data.refresh_token;
      // console.log(JSON.stringify(data));
      // console.log(localStorage.accessToken);
      // console.log(localStorage.refreshToken);
      //getDataProfile();

      


    });


  }*/
/*
  generateToken() {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ["https://www.googleapis.com/auth/indexing"],
      null
    );
    //client_Secret ES API KEY
    jwtClient.authorize({
      client_id: 115614114276937478984,
      client_secret: "195f0ad07d8cbaa3a0485966326e884058f474fa",
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }).done(function (data) {
      localStorage.accessToken = data.access_token;
      localStorage.refreshToken = data.refresh_token;
      // console.log(JSON.stringify(data));
      // console.log(localStorage.accessToken);
      // console.log(localStorage.refreshToken);
      //getDataProfile();


    });*/



    /* let options = {
       url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
       method: "POST",
       // Your options, which must include the Content-Type and auth headers
       headers: {
         "Content-Type": "application/json"
       },
       auth: { "bearer": tokens.access_token },
       // Define contents here. The structure of the content is described in the next step.
       json: {
         "url": "http://example.com/jobs/42",
         "type": "URL_UPDATED"
       }

       /*request(options, function (error, response, body) {
         // Handle the response
         console.log(body);
       });
     }
   });
  }*/




  /*
  example(id) {
    async.series([
      function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('./google-generated-creds.json');
        // OR, if you cannot save the file locally (like on heroku)
        var creds_json = {
          client_email: 'spreadsheets@colacteosapp.iam.gserviceaccount.com',
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC7kV7RT6v//XSa\ncpM45W8+yJIXgbMjQyU4U6eFw5fJgmy9+Y6UjrReLPSlWgUcJ5zPswJ0hQw91krQ\nmDC0D5Tr2DnOfYXVZYXNTOFqrECLoxl1zKDevcmnOrN8TMMxL8N28I7xP5HH96Od\nl8kYZXAW5FavKT4ZzjJr6dIVlqtuAVa3VQuD4wEp3eld28XxeAMsxyz7D3/1KPHz\nD9Cg9MXbg0TiRARjP6/AmCnWr5z+qAgNKN/0VQybDv92nS5BxHUhhODmSgUSjZX2\ngaNlzTs5Pq4d25+SzJItiGLGGB3+zkL2fU/hYDPIgQjRfZHkBHAxxB/gYwsWrpDV\nwT+zS6w9AgMBAAECggEAFdNinySQNSd/DAHNE8/O1BVuuoGDINVNXXKOicgqv24H\nzUtexfadEmBUz3DcK1yIqLqBzKE2vXNUHVW4RRuTDqaIg3ijvCMmIK+Tg2Ar2pPO\nAKEhDwoyjt0Lyaj9BZozOoHfgD8PbZ9pUIs7ATW8h01msNcxvLr7rwb0RULVC+W0\ncxzgQoQgZ4uHCVMkYaD1tKX2Uj93EtDXrDnCxMEVnPumGbhf/pVSqgVDHqNkv4JJ\n1C1iQn4H151xaZMJhlaeeatNg+kRRc3n2jqINfnM/aU7sfKQs5BV7wC4FOi9axw9\nJUes1FNlHM+JV4A3nDqu+iK/kGcN6wO3zWmiqD7C2QKBgQD9RSiA+8HC+e07KOfg\nXgmSH1lXwM2W929koLaRi2ogMulRfsETuZqpxeuKSfyCERFfpgmcLbD2pkLPvEyX\nXder+70+7SQES8S+bHceeFYDcPVC/WapReBdKHksmBpUy5LhnyUPkzIwDuQCNarG\nsRA/7z6mNSjUmRCB6wMvFdb4YwKBgQC9luvoWFBpGZXSgBMxe+NJDQmP7u9aLXaZ\nK1wqynxEX0+GTzg5aK1fstadIs37NVM0o9eLwLkWxhfROrxxyJg7EoS5BzpfnUDU\nlKLXoB8ZdEnpG0dJNmV5/lLZ4Fn02Gedtw6YqPGbyZITu6l3U+i8A+Ph5YzZkYCw\n87DWEvfa3wKBgE6smwZmLixpAp5r+Iuj6okvn8s4oySQPFQf8FaJ3i+eYQflvgho\nkXjHeIF+tieZMbJqm3WeY+hagUqSjaA/kG1mR8UyWQvUlYspml8mtmFfR3DF0owm\nnqmRlwKZRSSuEDRyAUszSFXRaladYS1Td17E7MsonEReP9h7roOD30FNAoGAeRVq\nlXnR4U314frqRzBYeM9azBJNy8o9dJW8x5eKxiAZKi5uOjwgfn45kyIna8ki2vvJ\nLfhoPaNGktpwgDsc/p1VJtb28Rn9zccgOZaKRjd+/OHvJVMYfFFxmLUwvq93fcLs\nD5PWuyiBoxi3ov50JaBWam+xBUNobZs11YNHyQECgYA/ECF0+m1jHODOocMlDacB\nyjmN6eQcPo70wI1qkox9YGC/3yFAJOglQxu4G9I3La5tGgIKuqrxPQfs6xBSmMgZ\nP16MvfD1O3vFDXHQeA8ziBG5tzSoNzqPovLpw7axuPbW1danvDGrBfZDZjDX8+Of\nPbi5yJupTmD/zJndV+WTTg==\n-----END PRIVATE KEY-----\n"
        }

        doc.useServiceAccountAuth(creds, step);
      },
      function getInfoAndWorksheets(step) {
        doc.getInfo(function (err, info) {
          console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
          sheet = info.worksheets[0];
          console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
          step();
        });
      },
      function workingWithRows(step) {
        // google provides some query options
        sheet.getRows({
          offset: 1,
          limit: 20,
          orderby: 'col2'
        }, function (err, rows) {
          console.log('Read ' + rows.length + ' rows');

          // the row is an object with keys set by the column headers
          rows[0].colname = 'new val';
          rows[0].save(); // this is async

          // deleting a row
          rows[0].del();  // this is async

          step();
        });
      },
      function workingWithCells(step) {
        sheet.getCells({
          'min-row': 1,
          'max-row': 5,
          'return-empty': true
        }, function (err, cells) {
          var cell = cells[0];
          console.log('Cell R' + cell.row + 'C' + cell.col + ' = ' + cell.value);

          // cells have a value, numericValue, and formula
          cell.value == '1'
          cell.numericValue == 1;
          cell.formula == '=ROW()';

          // updating `value` is "smart" and generally handles things for you
          cell.value = 123;
          cell.value = '=A1+B2'
          cell.save(); //async

          // bulk updates make it easy to update many cells at once
          cells[0].value = 1;
          cells[1].value = 2;
          cells[2].formula = '=A1+B1';
          sheet.bulkUpdateCells(cells); //async

          step();
        });
      },
      function managingSheets(step) {
        doc.addWorksheet({
          title: 'my new sheet'
        }, function (err, sheet) {

          // change a sheet's title
          sheet.setTitle('new title'); //async

          //resize a sheet
          sheet.resize({ rowCount: 50, colCount: 20 }); //async

          sheet.setHeaderRow(['name', 'age', 'phone']); //async

          // removing a worksheet
          sheet.del(); //async

          step();
        });
      }
    ], function (err) {
      if (err) {
        console.log('Error: ' + err);
      }
    }).subscribe(data=>{
      var params = {
        "range": "Sheet1!A:C",
        "majorDimension": "ROWS",
        "values": [
          ["name", "address", "email"]
        ],
      }
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', 'https://sheets.googleapis.com/v4/spreadsheets/' + id + '/' + "values/" + "Sheet1!A:C?" + 'valueInputOption=USER_ENTERED');

      //let data = { username: 'TEST', password: 'TEST123' }

      xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.stringify(localStorage.accessToken));

      xhr.send(JSON.stringify(params));
    });
  }*/

}
