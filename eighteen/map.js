
//create base layer
var myWMSTiles = new ol.layer.Tile({
          source: new ol.source.TileWMS({
            url: 'http://144.6.239.43:8080/geoserver/opengeo/wms',
            params: {
              'LAYERS': 'opengeo:meowworld',
              'FORMAT': 'image/jpeg',
			  'TRANSPARENT': 'false',
			  'BGCOLOR': '0x222222'
            },
            serverType: 'mapserver'
          })
        })

//http://144.6.239.43:8080/geoserver/opengeo/wms?service=WMS&version=1.1.0&request=GetMap&layers=opengeo:meowworld&styles=&bbox=-180.00000000007876,-89.99892578124998,180.00000000000003,86.91939628867601&width=768&height=377&srs=EPSG:4326&format=image%2Fpng

//create map
var map = new ol.Map({
  layers: [myWMSTiles],
  target: 'map', 
  view: new ol.View({
    center: [-26.851989, 137.185032],
    zoom: 2,
	minZoom: 2,
	maxZoom: 11
  })
});