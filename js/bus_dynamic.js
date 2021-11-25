var map = L.map('map', {
    zoomControl: false
})
const cityData = [
    { "CityName": "臺北市", "City": "Taipei", },
    { "CityName": "新北市", "City": "NewTaipei", },
    { "CityName": "桃園市", "City": "Taoyuan", },
    { "CityName": "臺中市", "City": "Taichung", },
    { "CityName": "臺南市", "City": "Tainan", },
    { "CityName": "高雄市", "City": "Kaohsiung", },
    { "CityName": "基隆市", "City": "Keelung", },
    { "CityName": "新竹市", "City": "Hsinchu", },
    { "CityName": "新竹縣", "City": "HsinchuCounty", },
    { "CityName": "苗栗縣", "City": "MiaoliCounty", },
    { "CityName": "彰化縣", "City": "ChanghuaCounty", },
    { "CityName": "南投縣", "City": "NantouCounty", },
    { "CityName": "雲林縣", "City": "YunlinCounty", },
    { "CityName": "嘉義縣", "City": "ChiayiCounty", },
    { "CityName": "嘉義市", "City": "Chiayi", },
    { "CityName": "屏東縣", "City": "PingtungCounty", },
    { "CityName": "宜蘭縣", "City": "YilanCounty", },
    { "CityName": "花蓮縣", "City": "HualienCounty", },
    { "CityName": "臺東縣", "City": "TaitungCounty", },
    { "CityName": "金門縣", "City": "KinmenCounty", },
    { "CityName": "澎湖縣", "City": "PenghuCounty", },
    { "CityName": "連江縣", "City": "LienchiangCounty", }
]
var City = '';
$(document).ready(function () {
    new SlimSelect({
        select: '#bus-type',
        showSearch: false,
        placeholder: '請選擇類別',
        allowDeselectOption: true
    })

    // 防止區域元素觸發 leaflet map event
    L.DomEvent.disableClickPropagation(L.DomUtil.get('county-list'));
    L.DomEvent.disableScrollPropagation(L.DomUtil.get('county-list'));

    // 原始點定位及縮放大小
    // mapbox://styles/graysonlin512/ckw8gvwxpaeph15rz66cxjm09
    map.setView(new L.LatLng(23.794082453027436, 120.97790316609922), 8);
    var accessToken = 'pk.eyJ1IjoiZ3JheXNvbmxpbjUxMiIsImEiOiJja3c3emlhMGE3aWsyMm5tdHo5bjA3ZmV5In0.JL6wR5AnmWuiWlVEzBoB2w';
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'graysonlin512/ckw8gvwxpaeph15rz66cxjm09', // 在 mapbox studio 設定語系
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
    }).addTo(map);

    // 設定 zoom btn 位置
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 縣市選單
    getCounty();
    // 獲取路線
    getRoute();
});

function countyListCreate() {
    cityData.forEach((item) => {
        var county_btn =
            `<div class="county-btn d-flex justify-content-center align-items-center">
                <div class="btn-bg-circle rounded-circle d-flex justify-content-center align-items-center">
                    <p class="mb-0">
                        <input class="county" type="hidden" value="${item.City}">${item.CityName}
                    </p>
                </div>
            </div>`;
        $('.county-list').append(county_btn);
    })
}

function toggleList() {
    $('.county-list').toggleClass('active');
}

// 側邊選單消失
var BusDynamicList = document.querySelector('.bus-dynamic-list')
var listBtn = document.querySelector('.list-btn')
var listBtnMap = document.querySelector('.list-btn-map')
var countyList = document.querySelector('.county-list')

L.DomEvent.disableClickPropagation(L.DomUtil.get('list-btn-map'));
L.DomEvent.disableScrollPropagation(L.DomUtil.get('list-btn-map'));

listBtn.addEventListener('click', function () {
    BusDynamicList.classList.add('active-list')
    listBtnMap.classList.add('list-btn-map-active')
    listBtn.classList.add('list-btn-active')
    countyList.classList.remove('active')

    // 地圖縮放
    setTimeout(function () {
        window.map.invalidateSize();
    }, 600);
})

// 側邊選單出現
listBtnMap.addEventListener('click', function () {
    var activeList = document.querySelector('.active-list')

    BusDynamicList.classList.remove('active-list')
    listBtnMap.classList.remove('list-btn-map-active')
    listBtn.classList.remove('list-btn-active')
    // 地圖縮放
    setTimeout(function () {
        window.map.invalidateSize();
    }, 600);
})

function getCounty() {
    countyListCreate();
    $('.select-county').on('click', function () {
        toggleList();
    })
}

function clickCountyBtn() {
    // 點擊縣市選單
    $('.county-btn').each(function () {
        $(this).on('click', function () {
            var city = $(this).find('.county').val()
            var cityName = $.trim($(this).find('p').text())
            $('.select-county').text(cityName); // 顯示縣市
            $('.county-list').removeClass('active');
            City = city;
        })
    })
}

function getRoute() {
    clickCountyBtn();
    new SlimSelect({
        select: '#search_bus',
        placeholder: '請輸入路線',
        searchingText: '尋找路線中...', // Optional - Will show during ajax request
        searchPlaceholder: '請輸入路線號碼或起迄站',
        searchText: '查無此路線',
        ajax: function (search, callback) {
            // Check search value. If you dont like it callback(false) or callback('Message String')
            if (search.length < 1) {
                callback('請至少輸入一個字')
                return
            }

            // Perform your own ajax request here
            var url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${City}?$top=30&$format=JSON`;
            fetch(url, {
                headers: GetAuthorizationHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                let data = []
                json.forEach((item) => {
                    console.log(item);
                    data.push({
                        text: '[' + item.RouteID + '] ' + item.DepartureStopNameZh + ' - ' + item.DestinationStopNameZh
                    })
                })

                // Upon successful fetch send data to callback function.
                // Be sure to send data back in the proper format.
                // Refer to the method setData for examples of proper format.
                callback(data)
            }).catch(function (error) {
                // If any erros happened send false back through the callback
                callback(false)
            });
        }
    });
}


