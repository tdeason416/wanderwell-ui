/// <reference path="./typings/googlemaps/google.maps.d.ts" />
/// <reference path="./typings/markerclustererplus/markerclustererplus.d.ts" />
var Mapping;
(function (Mapping) {
    var GoogleMap = (function () {
        var test = 1;
        var map;
        var heatMap;
        function GoogleMap(mapDiv, data, type) {

            var devs = data;
            var lats = [], longs = [];
            var center;
            // devs.map(function (value) {
            //     lats.push(value.latitude);
            //     longs.push(value.longitude);
            // });

            this.name = "GoogleMap";
            this.options = {
                center: { lat: 37.78, lng: -122.447 },
                scrollwheel: false,
                zoom: 15,
            };

            map = new google.maps.Map(mapDiv, this.options);

 
            map.data.loadGeoJson(
                'https://storage.googleapis.com/mapsdevsite/json/google.json');

            // map.data.loadGeoJson(
            //     './portland.geo.json');

            this.addHeatMapLayer(data, map);
            // this.addBarHeatMapLayer(data, map);
        }

        var heatMapData = [
            { location: new google.maps.LatLng(37.782, -122.447), weight: 1 },
            { location: new google.maps.LatLng(37.782, -122.443), weight: 2 },
            { location: new google.maps.LatLng(37.782, -122.441), weight: 5 },

        ];

        var barsHeatMapData = [

            { location: new google.maps.LatLng(37.785, -122.435), weight: 5 },
            { location: new google.maps.LatLng(37.785, -122.447), weight: 6 },

        ];


        GoogleMap.prototype.setOpacity = function (opVal) {
            console.log(opVal.toFixed(1));
            // heatmap.set('opacity', heatmap.get('opacity') ? null : opVal.toFixed(1));
            heatmap.set('opacity', opVal.toFixed(1));
        }

        GoogleMap.prototype.addHeatMapLayer = function (data, map) {
            var points = [];
            // var devs = data;
            // var devs = heatMapData;
            // devs.map(function (value) {
            //     points.push(new google.maps.LatLng(value.latitude, value.longitude));
            // });
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                map: map,
                radius: 20,
                // opacity: 1
            });

            var gradient = [
                'rgba(55, 27, 7, 0)',
                'rgba(55, 27, 7, 1)',
                'rgba(75, 49, 31, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(94, 72, 56, 1)',
                'rgba(255, 0, 0, 1)'


            ]
            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        };

        GoogleMap.prototype.addBarHeatMapLayer = function (data, map) {
            var points = [];

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: barsHeatMapData,
                map: map,
                radius: 20,
                opacity: 1
            });

            var gradient = [
                'rgba(55, 27, 7, 0)',
                'rgba(255, 0, 0, 1)'

            ]
            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        };

        return GoogleMap;
    }());
    Mapping.GoogleMap = GoogleMap;
})(Mapping || (Mapping = {}));
