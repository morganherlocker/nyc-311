NYC 311
---

Processing scripts for time series analysis of [NYC 311 data, from 2010-2015](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9).

Running
---

Clone this repo & install dependencies

```
git clone https://github.com/morganherlocker/nyc-311.git
cd nyc-311
npm install
```

Download the data (note: there is a lot of data, so this will take a while)

`curl https://data.cityofnewyork.us/api/views/fvrb-kbbt/rows.json\?accessType\=DOWNLOAD -o 311.json`

Aggregate on 1/2mi grid with monthly counts and totals

`node index.js`

Count monthly totals per borough

`node boroughs.js`