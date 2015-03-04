NYC 311
---

Processing scripts for time series analysis of [NYC 311 data](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2).

Running
---

Clone this repo & install dependencies

```
git clone https://github.com/morganherlocker/nyc-311.git
cd nyc-311
npm install
```

Download the data (note: there is a lot of data, so this will take a while)

`curl curl https://data.cityofnewyork.us/api/views/fvrb-kbbt/rows.json\?accessType\=DOWNLOAD -o 311.json`

Aggregate on 1/2mi grid with monthly counts and totals

`node index.js`
