let locationUri = URI(location.href);
let requestParams = locationUri.search(true);
console.log('requestParams', requestParams);

let map = L.map('map');
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'pk.eyJ1IjoiYmxhY2todW1hbiIsImEiOiJjamoxNzFldHkwbzZuM2tvZ2NmcWlmdngyIn0.a6vH_Y8hBgCidi4uQrmNAg'
// }).addTo(map);
L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 5
}).addTo(map);
// L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
//     maxZoom: 18,
//     minZoom: 5
// }).addTo(map);
// L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
//     maxZoom: 18,
//     minZoom: 5
// }).addTo(map);
let requestUri = URI('https://1709506130841502.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/gpsspg/gpsspg_get_cellular_info/')
.addSearch('c', requestParams.c)
.toString();

// let requestUri = URI('http://api.gpsspg.com/bs/')
// .addSearch('oid', '9693') // 订阅 id. API 控制台 选择项目后在【已订阅的 API】下订阅开通与查看 oid
// .addSearch('key', '9610xxy6v874792x8wv487y90859663x12654') // 订阅 key. API 控制台 选择项目后在【请求凭据 Key】下创建与查看 key
// .addSearch('type', '') // 网络类型. 可选值：gsm、umts、lte、cdma。cdma 时必填
// // 基站信息
// // GSM/UMTS: MCC,MNC,LAC,CI 或 MCC,MNC,LAC,CI,dBm 
// // LTE: MCC,MNC,TAC,CI 或 MCC,MNC,TAC,CI,dBm 
// // CDMA: MCC,SID,NID,BID 或 MCC,SID,NID,BID,dBm 
// // 多基站分隔符号: |
// .addSearch('bs', requestParams.c) // 基站信息
// .addSearch('hex', '10') // 进制. 10进制或16进制，MCC / MNC / dbm 必须为10进制
// // 坐标类型
// // 0 WGS84 / GPS坐标，适用于谷歌地球 Google Earth。 
// // 1 Google 坐标，适用于 Google Maps 地图模式。 
// // 2 百度坐标，适用于百度地图。 
// // 3 高德腾讯坐标，适用于高德地图/腾讯地图。	
// .addSearch('to', 3) // 坐标类型
// .addSearch('output', 'json') // 返回数据格式. 推荐：json / jsonp / xml，试验性：html / txt
// // .addSearch('callback') // js 回调函数. jsonp 时有效。jQuery 发起 jsonp 跨域请求时会自动附加此参数。
// .toString();
console.log('requestUri', requestUri);
fetch(requestUri)
.then(response => response.json())
.then(data => {
    if (data.latitude === undefined || data.longitude === undefined) {
        data.latitude = 39.904989;
        data.longitude = 116.401165;
    }
    return data;
})
.then(data => {
    console.log('data', data);
    // data.latitude;
    // data.longitude;
    // data.match;
    // data.status;
    let center = [data.latitude, data.longitude];
    map.setView(center, 15);
    let markers = [];
    let circles = [];
    let popups = [];
    data.result.forEach(item => {
        // item.address;
        // item.id;
        // item.lat, item.lng;
        // item.radius;
        // item.roads;
        // item.rid;
        // item.rids;
        let center = [item.lat, item.lng];
        markers.push(L.marker(center));
        circles.push(L.circle(center, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3,
            stroke: false,
            radius: item.radius
        }));
        popups.push(L.popup()
        .setLatLng(center)
        .setContent(`<b>${item.address}</b><br>${item.roads}`));
    });
    let overlays = {
        "Marker": L.layerGroup(markers).addTo(map),
        "Circle": L.layerGroup(circles).addTo(map),
        "Popup": L.layerGroup(popups)
    };
    L.control.layers([], overlays).addTo(map);
});
