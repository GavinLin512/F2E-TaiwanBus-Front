const cityData = [{
    "CityName": "臺北市",
    "City": "Taipei",
    "Latitude": "25.049315",
    "Longitude": "121.556350"
},
{
    "CityName": "新北市",
    "City": "NewTaipei",
    "Latitude": "25.020454",
    "Longitude": "121.463417"
},
{
    "CityName": "桃園市",
    "City": "Taoyuan",
    "Latitude": "24.995623",
    "Longitude": "121.302609"
},
{
    "CityName": "臺中市",
    "City": "Taichung",
    "Latitude": "24.141403",
    "Longitude": "120.672468"
},
{
    "CityName": "臺南市",
    "City": "Tainan",
    "Latitude": "23.004630",
    "Longitude": "120.233226"
},
{
    "CityName": "高雄市",
    "City": "Kaohsiung",
    "Latitude": "22.629321",
    "Longitude": "120.305139"
},
{
    "CityName": "基隆市",
    "City": "Keelung",
    "Latitude": "25.120467",
    "Longitude": "121.735318"
},
{
    "CityName": "新竹市",
    "City": "Hsinchu",
    "Latitude": "24.813644",
    "Longitude": "120.967638"
},
{
    "CityName": "新竹縣",
    "City": "HsinchuCounty",
    "Latitude": "24.733504",
    "Longitude": "121.009000"
},
{
    "CityName": "苗栗縣",
    "City": "MiaoliCounty",
    "Latitude": "24.504408",
    "Longitude": "120.825374"
},
{
    "CityName": "彰化縣",
    "City": "ChanghuaCounty",
    "Latitude": "23.957887",
    "Longitude": "120.554625"
},
{
    "CityName": "南投縣",
    "City": "NantouCounty",
    "Latitude": "23.955956",
    "Longitude": "120.960558"
},
{
    "CityName": "雲林縣",
    "City": "YunlinCounty",
    "Latitude": "23.700432",
    "Longitude": "120.531036"
},
{
    "CityName": "嘉義縣",
    "City": "ChiayiCounty",
    "Latitude": "23.461176",
    "Longitude": "120.244460"
},
{
    "CityName": "嘉義市",
    "City": "Chiayi",
    "Latitude": "23.477156",
    "Longitude": "120.448815"
},
{
    "CityName": "屏東縣",
    "City": "PingtungCounty",
    "Latitude": "22.556303",
    "Longitude": "120.544269"
},
{
    "CityName": "宜蘭縣",
    "City": "YilanCounty",
    "Latitude": "24.748737",
    "Longitude": "121.755861"
},
{
    "CityName": "花蓮縣",
    "City": "HualienCounty",
    "Latitude": "23.980801",
    "Longitude": "121.583050"
},
{
    "CityName": "臺東縣",
    "City": "TaitungCounty",
    "Latitude": "22.770456",
    "Longitude": "121.139405"
},
{
    "CityName": "金門縣",
    "City": "KinmenCounty",
    "Latitude": "24.450398",
    "Longitude": "118.382263"
},
{
    "CityName": "澎湖縣",
    "City": "PenghuCounty",
    "Latitude": "23.574348",
    "Longitude": "119.604932"
},
{
    "CityName": "連江縣",
    "City": "LienchiangCounty",
    "Latitude": "26.196468",
    "Longitude": "119.968823"
}
]
var map = L.map('map', {
    zoomControl: false
})
var cityEn = '';
var searchBus;
var tempCity = '';
var tempLatitude = '';
var tempLongitude = '';
var tempRouteID = '';
var direction = '0'; // 預設去程
var StopData = [];
var StopLocation = [];

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
    // console.log(searchBus.selected());
    // getStationData('0', '');
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
    // var activeList = document.querySelector('.active-list')

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
    btn.classList.add('active');
    $(btn).siblings('.tab').removeClass('active');
    if (cityEn != '') {
        // StopData = []; // 先清空另一邊的資料
        $('.stop').each(function () {
            $(this).remove();
        });
        // 去程資料
        if ($('#go').hasClass('active')) {
            direction = '0';
        };
        // 返程資料
        if ($('#back').hasClass('active')) {
            direction = '1';
        };
        getStationData(direction, cityEn);
    }
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
            $('.select-county').text('目前選擇：' + cityName); // 顯示縣市
            $('.county-list').removeClass('active');
            cityEn = city; // 切換縣市路線
            searchBus.enable();
            // map 定位
            cityData.forEach((item) => {
                if (item.City == city) {
                    tempLatitude = item.Latitude;
                    tempLongitude = item.Longitude;
                }
            });
            map.setView(new L.LatLng(parseFloat(tempLatitude), parseFloat(tempLongitude)), 13);
            // 初始化select
            searchBus.set('');
            searchBus.search('');
            $(searchBus.slim.container).find('.ss-disabled').css('color', '#666666');
            // 初始化 table
            $('.stop').each(function () {
                $(this).remove();
            });
            $('.noResult').css('display','table-cell');
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
        // 修改搜尋 bug
        if ($('.ss-content').hasClass('ss-open')) {
            searchBus.set('');
            $(searchBus.slim.container).find('.ss-disabled').css('color', '#666666');
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
            // 取得指定[縣市]的市區公車路線資料
            var url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${cityEn}?$format=JSON`;
            fetch(url, {
                headers: GetAuthorizationHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                // console.log(json);

                let data = []
                json.forEach((item) => {
                    // console.log(item);
                    if (item.DepartureStopNameZh == undefined) {
                        data.push({
                            text: '[' + item.RouteName.Zh_tw + '] ' + item.SubRoutes[0].Headsign
                                + `<input class="routeID" type="hidden" value="${item.RouteID}">`
                        })
                    } else {
                        data.push({
                            text: '[' + item.RouteName.Zh_tw + '] ' + item.DepartureStopNameZh + ' - ' + item.DestinationStopNameZh
                                + `<input class="routeID" type="hidden" value="${item.RouteID}">`
                        })
                    }
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
        },
        onChange: (info) => {
            // 取得路線ID
            tempRouteID = $(searchBus.slim.container).find('.ss-single-selected').children('.placeholder').children('.routeID').val();
            // 清除上一個搜尋的資料
            $('.stop').each(function () {
                $(this).remove();
            });
            StopData = []; // 不重複獲取站牌資料
            getStationData('0', cityEn); // 預設取得去程資料
            // getStopTime('0',cityEn, StopData);
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
function getStationData(direction, city) {
    // console.log(direction, city);
    if (direction != '') {
        fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${city}/1?$format=JSON`, {
            headers: GetAuthorizationHeader(),
            method: 'GET',
        }).then(function (response) {
            return response.json();
        }).then(function (routeData) {
            // 所有路線站牌資料
            var stopsDataAll = routeData.filter((item) => {
                return item.Direction == direction;
            })
            // console.log(stops);
            // 指定路線站牌資料
            // console.log(tempRouteID,stops);
            if (tempRouteID == '') {
                alert('請選擇路線');
            }
            // console.log(tempRouteID);
            var busStopsData = stopsDataAll.filter((item) => {
                // console.log(item.RouteID,typeof item.RouteID);
                return item.RouteID == tempRouteID;
            })
            // 過濾重複的資料
            if (busStopsData.length == 2) {
                var busStops_repeat = busStopsData.filter((item) => {
                    // console.log(item.RouteID, item.SubRouteID);
                    return item.RouteID == item.SubRouteID;
                })
                busStopsData = busStops_repeat
            }
            // 過濾後站牌資料為空不觸發
            if (busStopsData.length != 0) {
                busStopsData[0].Stops.forEach((item) => {
                    // console.log(item);
                    StopData.push({
                        StopID: item.StopID,
                        StopSequence: item.StopSequence,
                        StopName: item.StopName.Zh_tw,
                        StopPosition: {
                            PositionLat: item.StopPosition.PositionLat,
                            PositionLon: item.StopPosition.PositionLon
                        }
                    });
                })
            }
            pushStopData(StopData);
            getStopTime('0',cityEn,StopData);
        });
    }
}

function pushStopData(data) {
    // console.log(data);
    $('.noResult').css('display','none');
    
    data.forEach((item) => {
        // console.log(item);
        var stopHTML = `
        <tr class="stop">
            <td>${item.StopSequence}</td>
            <td>${item.StopName}</td>
            <td>555-AAA</td>
            <td>
                <div class="btn btn-primary w-75 arrive-time">15:30</div>
            </td>
        </tr>
        `
        // console.log($('tbody'));
        $('tbody').append(stopHTML);
    })
}



// 預估到站資料，預估到站時間和車牌號碼
function getStopTime(direction, city, stopData) {
    // console.log(direction,city,stopData);

    var StopURL = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${city}/1?$format=JSON`
    // var StopURL = 'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/Streaming/City/Taipei/1?$format=JSON'
    let busData = []
    fetch(StopURL, {
        headers: GetAuthorizationHeader(),
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        // 所有路線預估時間資料
        const stopsTimeDataAll = json.filter((item) => {
            return item.Direction == direction;
        })
        // 單筆路線預估時間資料
        var busStopsTimeData = stopsTimeDataAll.filter((item) => {
            return item.RouteID == tempRouteID;
        })
        console.log(busStopsTimeData,stopData);
        // for (var i=0; i<busStopsTimeData.length; i++) {
        //     console.log(busStopsTimeData[i],stopData[i]);
        //     // if (busStopsTimeData[i].StopID == stopData[i].StopID) {
        //     // }
        // }
        // var tempBusStopsTimeData = '';
        // busStopsTimeData.forEach((item) => {
        //     // console.log(item);
        //     tempBusStopsTimeData = item.StopID;
        // })
        // var tempStopData = '';
        // StopData.forEach((stop) => {
        //     tempStopData
        // })
        // console.log(busStopsTimeData);

    })
}