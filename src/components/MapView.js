import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function generateLeafletHTML({ stations, center }) {
  const stationsJson = JSON.stringify(stations);

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  *{margin:0;padding:0}
  html,body,#map{width:100%;height:100%;background:#050A15}
  .leaflet-control-attribution{display:none}
  .leaflet-tile-pane{filter:saturate(0) brightness(0.82)}

  .marker{
    background:#00BAFF;color:#050A15;
    padding:8px 16px;border-radius:10px;
    font:700 13px/1 sans-serif;
    white-space:nowrap;
    border:2px solid #00BAFF;
    box-shadow:0 2px 8px rgba(0,0,0,0.35);
    transform:translate(-50%,-100%);
    margin-top:-6px;
  }
  .marker.free{background:#00FF8C;border-color:#00FF8C;color:#050A15}
  .marker.unavailable{background:#EF4444;border-color:#EF4444;color:#fff}

  .marker-dot{
    width:12px;height:12px;border-radius:50%;
    background:#00BAFF;
    border:3px solid #050A15;
    transform:translate(-50%,-50%);
    box-shadow:0 0 0 4px rgba(0,186,255,0.2);
  }
  .marker-dot.free{background:#00FF8C;box-shadow:0 0 0 4px rgba(0,255,140,0.2)}
  .marker-dot.unavailable{background:#EF4444;box-shadow:0 0 0 4px rgba(239,68,68,0.2)}

  .user-dot{
    width:12px;height:12px;border-radius:50%;
    background:#00BAFF;
    border:3px solid #050A15;
    box-shadow:0 0 0 4px rgba(0,186,255,0.25),0 2px 6px rgba(0,0,0,0.4);
  }
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var map=L.map('map',{
    center:[${center.latitude},${center.longitude}],
    zoom:13,zoomControl:false,attributionControl:false
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    subdomains:'abcd',maxZoom:20
  }).addTo(map);

  function fmtPrice(p){return '$'+Math.round(p).toLocaleString('es-CO')}

  function markerClass(s){
    if(!s.available)return 'unavailable';
    return s.pricePerKWh===0?'free':'';
  }

  function buildHTML(s){
    var cls='marker '+markerClass(s);
    var dotCls='marker-dot '+markerClass(s);
    var label=s.pricePerKWh===0?'Gratis':fmtPrice(s.pricePerKWh);
    return '<div class="'+cls+'">'+label+'</div>'+
           '<div class="'+dotCls+'"></div>';
  }

  var stations=${stationsJson};
  var markers={};

  stations.forEach(function(s){
    var m=L.marker([s.latitude,s.longitude],{
      icon:L.divIcon({className:'',html:buildHTML(s),iconSize:[0,0],iconAnchor:[0,0]})
    }).addTo(map);

    m.on('click',function(e){
      L.DomEvent.stopPropagation(e);
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'station',id:s.id}));
    });
    markers[s.id]=m;
  });

  map.on('click',function(){
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'map'}));
  });

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      L.marker([pos.coords.latitude,pos.coords.longitude],{
        icon:L.divIcon({className:'',html:'<div class="user-dot"></div>',iconSize:[12,12],iconAnchor:[6,6]}),
        zIndexOffset:2000
      }).addTo(map);
    });
  }

  function handleMsg(e){
    try{
      var d=JSON.parse(e.data);
      if(d.type==='flyTo')map.flyTo([d.latitude,d.longitude],d.zoom||14,{duration:0.8});
    }catch(err){}
  }
  document.addEventListener('message',handleMsg);
  window.addEventListener('message',handleMsg);
})();
</script>
</body>
</html>`;
}

export default function MapViewComponent({
  stations = [],
  center = { latitude: 10.995, longitude: -74.80 },
  onStationPress,
  onMapPress,
  style,
}) {
  const webViewRef = useRef(null);
  const [ready, setReady] = useState(false);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'station' && onStationPress) {
        const station = stations.find((s) => s.id === data.id);
        if (station) onStationPress(station);
      }
      if (data.type === 'map' && onMapPress) onMapPress();
    } catch {}
  };

  const html = generateLeafletHTML({ stations, center });

  const flyTo = (lat, lng, zoom = 14) => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'flyTo', latitude: lat, longitude: lng, zoom }));
  };

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.flyTo = flyTo;
    }
  }, [ready]);

  return (
    <View style={[{ flex: 1, backgroundColor: '#050A15' }, style]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#050A15' }}
        onMessage={handleMessage}
        onLoad={() => setReady(true)}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['*']}
        allowFileAccess
        mixedContentMode="always"
      />
    </View>
  );
}

export { generateLeafletHTML };
