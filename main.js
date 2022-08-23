const BITCOIN_API_BASE = "https://api.coingecko.com/api/v3/coins/bitcoin/";
const DATE_INPUT = "datetime_input";


const setInitialDate = () => {
    const datetimeInputEl = document.getElementById('datetime_input');
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    datetimeInputEl.value = localISOTime.slice(0, 16)
}

const formatDateString = (dt) => {
    const yyyy = dt.substr(0, 4);
    const mm = dt.substr(5, 2);
    const dd = dt.substr(8, 2);
    return `${dd}-${mm}-${yyyy}`;
}

function getNextLottoDraw(dateTimeSelect) {
    let nextWed = new Date(dateTimeSelect);
    let nextSat = new Date(dateTimeSelect);

    nextWed.setDate(nextWed.getDate() + (((3 + 7 - nextWed.getDay()) % 7) || 7));
    nextSat.setDate(nextSat.getDate() + (((6 + 7 - nextSat.getDay()) % 7) || 7));

    return (nextWed > nextSat ? nextSat : nextWed)

}


const lottoDate = () => {
    const datetimeInputEl = document.getElementById('datetime_input');
    let d = new Date(datetimeInputEl.value);
    let e = datetimeInputEl.value;
    let lottoDrawDate;
    if (parseInt(e.substr(11, 2)) >= 20 || (d.getDay() != 3 && d.getDay() != 6)) {

        const f = getNextLottoDraw(e);
        lottoDrawDate = formatDateString(f.toISOString());
        lottoDrawDateTime = lottoDrawDate + " 20:00";
    }
    else {
        lottoDrawDate = formatDateString(d.toISOString());
        lottoDrawDateTime = lottoDrawDate + " 20:00";
    }



    currentDate = formatDateString(new Date().toISOString());

    const drawDateData = getBitcoinPrice(lottoDrawDate);
    const currentDateData = getBitcoinPrice(currentDate);

    Promise.all([drawDateData, currentDateData]).then((responses) => {
        let drawDatePrice = responses[0].hasOwnProperty('market_data') ? responses[0].market_data.current_price['eur'] : 0,
            todayPrice = responses[1].hasOwnProperty('market_data') ? responses[1].market_data.current_price['eur'] : 0;

        const bt_purchased = 100 / drawDatePrice;
        const todayValue = todayPrice * bt_purchased;
        const finalValue = todayValue == (NaN || Infinity) ? 0: todayValue

        let tableRow = document.createElement('tr')
        tableRow.className = "table_row"
        tableRow.innerHTML = `<td>${lottoDrawDateTime}</td><td>€ ${finalValue.toFixed(2)}</td>`;

        const tbodyEl = document.querySelector('#content-table tbody');
        tbodyEl.appendChild(tableRow);
    })


    // Get Price

    function getBitcoinPrice(date) {
        return fetch(`${BITCOIN_API_BASE}/history?date=${date}`).then(response => response.json())
    }
}