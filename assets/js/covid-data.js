// DOM Variables
var newCasesEl = document.getElementById('new-cases');
var recoveredEl = document.getElementById('recovered');
var deathsEl = document.getElementById('deaths');
var riskLevelEl = document.getElementById('risk-level')
var zipInput = document.querySelector("#inputForm");
var zipEntry = document.querySelector("#zip-field");
var virtualEarthKey = "Ag9vSCbKCVavmpm_CAS77TmHeRGxbmAxECOfwknIrua4eOT9rwT4ifxTOuwC9-V0"
var zipCodeKey1 = "3gViGaWo0FXAWpATeUncO3LrgOb7olNRh6WyOq1qm7n1rvBkW5QEdo7ajb8GqS3o"
var openStatesKey = "72659b34-798d-4441-b6ee-c86ef9973ebb"
var covidNowKey = "bb14400183684b2eba37ecb5a94ee3ec"
var locationApiKey = "gP9CQYmEWlWJlQqnbTplLqofQ5aDvzJzR1dpk7McZKa6DDIuLdXEsfgJR50LpVfC"

// Capture form input toget FIPScode
var getCountyData = function (event) {
    event.preventDefault();
    // Set input value to a variables
    var localZip = zipEntry.value.trim();

    // Set api URL to variable based on local zip to get location
    var zipLocation = "https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/" + locationApiKey + "/info.json/" + localZip + "/degrees"
    // Initiate fetch request
    fetch(zipLocation).then(function (response) {
        response.json().then(function (data) {
            // Get data coordinates and Set to variables
            var localLat = data.lat
            var localLong = data.lng
            // Set api URL  to variable based on coodinates lat + lng to get county fips code
            var fipsFetch = "https://geo.fcc.gov/api/census/block/find?latitude=" + localLat + "&longitude=" + localLong + "&showall=true&format=json"
            // Intiate fetch request to get county fips code
            fetch(fipsFetch).then(function (response) {
                response.json().then(function (data) {
                    // Get data fips code and Set to global variable
                    var countyFIPS = data.County.FIPS;

                    // Set covidNow url to variable 
                    var covidApiURL = "https://api.covidactnow.org/v2/county/" + countyFIPS + ".json?apiKey=" + covidNowKey;
                    // Initiate fetch request to covidApi url
                    fetch(covidApiURL).then(function (response) {
                        response.json().then(function (data) {

                            // Get and display new cases
                            var newCases = data.actuals.newCases;
                            newCasesEl.innerHTML = " " + newCases;
                            
                            // Get total cases
                            var totalCases = data.actuals.cases;
                            
                            // Get and display death cases
                            var deathCnt = data.actuals.deaths;
                            //console.log(data.actuals.deaths)
                            deathsEl.innerText = " " + deathCnt;
                            
                            // Calculate and display recovered cases
                            var recoveredCnt = totalCases - deathCnt;
                            recoveredEl.innerHTML = " " + recoveredCnt

                            // Get and display risk level
                            var riskLevel = data.riskLevels.overall;
                            riskLevelEl.innerHTML = " " + riskLevel;
                            
                        })
                    })
                })

            })
        })
    })
}

inputForm.addEventListener("submit", getCountyData);
