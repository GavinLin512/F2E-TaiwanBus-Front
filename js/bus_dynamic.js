const cityData = [
    { "CityName": "臺北市", "City": "Taipei", "Location": "25.049315, 121.556350" },
    { "CityName": "新北市", "City": "NewTaipei", "Location": "25.020454, 121.463417" },
    { "CityName": "桃園市", "City": "Taoyuan", "Location": "24.995623, 121.302609" },
    { "CityName": "臺中市", "City": "Taichung", "Location": "24.141403, 120.672468" },
    { "CityName": "臺南市", "City": "Tainan", "Location": "23.004630, 120.233226" },
    { "CityName": "高雄市", "City": "Kaohsiung", "Location": "22.629321, 120.305139" },
    { "CityName": "基隆市", "City": "Keelung", "Location": "25.120467, 121.735318" },
    { "CityName": "新竹市", "City": "Hsinchu", "Location": "" },
    { "CityName": "新竹縣", "City": "HsinchuCounty", "Location": "" },
    { "CityName": "苗栗縣", "City": "MiaoliCounty", "Location": "" },
    { "CityName": "彰化縣", "City": "ChanghuaCounty", "Location": "" },
    { "CityName": "南投縣", "City": "NantouCounty", "Location": "" },
    { "CityName": "雲林縣", "City": "YunlinCounty", "Location": "" },
    { "CityName": "嘉義縣", "City": "ChiayiCounty", "Location": "" },
    { "CityName": "嘉義市", "City": "Chiayi", "Location": "" },
    { "CityName": "屏東縣", "City": "PingtungCounty", "Location": "" },
    { "CityName": "宜蘭縣", "City": "YilanCounty", "Location": "" },
    { "CityName": "花蓮縣", "City": "HualienCounty", "Location": "" },
    { "CityName": "臺東縣", "City": "TaitungCounty", "Location": "" },
    { "CityName": "金門縣", "City": "KinmenCounty", "Location": "" },
    { "CityName": "澎湖縣", "City": "PenghuCounty", "Location": "" },
    { "CityName": "連江縣", "City": "LienchiangCounty", "Location": "" }
]
var map = L.map('map', {
    zoomControl: false
})
var City = '';
var searchBus;
var tempCity = '';

$(document).ready(function () {
    // 公車類別
    var busType = new SlimSelect({
        select: '#bus-type',
        showSearch: false,
        placeholder: '請選擇類別',
        allowDeselectOption: true
    })
    // 自定樣式
    setSlimStyle(busType);

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

// 切換去回程
function tab(btn) {
    btn.classList.add('active')
    $(btn).siblings('.tab').removeClass('active')
}


function getCounty() {
    countyListCreate();
    $('.select-county').on('click', function () {
        $('.county-list').toggleClass('active');
    })
}

// 點擊縣市選單
function clickCountyBtn() {
    $('.county-btn').each(function () {
        $(this).on('click', function () {
            var city = $(this).find('.county').val()
            var cityName = $.trim($(this).find('p').text())
            tempCity = cityName;
            $('.select-county').text(cityName); // 顯示縣市
            $('.county-list').removeClass('active');
            City = city; // 切換縣市路線
            searchBus.enable();
        })
    })
}

function defaultSelectBus() {
    searchBus.disable();
    $('.bus-search').on('click', function () {
        if (tempCity == '') {
            searchBus.disable();
            alert('請先選擇縣市');
        }
    });
}

function getRoute() {
    clickCountyBtn();
    searchBus = new SlimSelect({
        select: '#search-bus',
        placeholder: '請輸入路線',
        searchingText: '尋找路線中...', // Optional - Will show during ajax request
        searchPlaceholder: '請輸入路線號碼或起迄站',
        searchText: '查無此路線',
        ajax: function (search, callback) {
            // Check search value. If you dont like it callback(false) or callback('Message String')
            if (search.length < 1) {
                callback('請至少輸入一個字');
                $(searchBus.slim.container).find('.ss-disabled').css('color', '#666666');
                $(searchBus.slim.container).find('.ss-option').css('padding', '6px 20px');
                return
            }

            // Perform your own ajax request here
            var url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${City}?$format=JSON`;
            fetch(url, {
                headers: GetAuthorizationHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                console.log(json);

                let data = []
                json.forEach((item) => {
                    // console.log(item);
                    data.push({
                        text: '[' + item.RouteID + '] ' + item.DepartureStopNameZh + ' - ' + item.DestinationStopNameZh
                    })

                })
                // console.log(searchBus);

                // Upon successful fetch send data to callback function.
                // Be sure to send data back in the proper format.
                // Refer to the method setData for examples of proper format.
                callback(data)
                // 自定樣式
                setSlimStyle(searchBus);
            }).catch(function (error) {
                // If any erros happened send false back through the callback
                callback(false)
            });
        }
    });
    // 自定樣式
    setSlimStyle(searchBus);
    // 預設防呆
    defaultSelectBus();
}

function setSlimStyle(select) {
    $(select.slim.container).find('.ss-single-selected').css('height', '40px');
    $(select.slim.container).find('.ss-main').css('color', '#666666');
    $(select.slim.container).find('.ss-disabled').css('color', '#666666');
    $(select.slim.container).find('.ss-option').css('padding', '6px 20px');
}


