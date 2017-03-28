var D3Mapping;
(function (D3Mapping) {
    var D3GoogleMap = (function () {
        // var test = 1;
        // var map;
        // var heatMap;

        var container, bins;
        function D3GoogleMap(lat, lng, mapDiv) {

            // var devs = data;
            var lats = [], longs = [];
            var center;


            // Create the Google Map…
            var map = new google.maps.Map(mapDiv, {
                zoom: 12,
                center: new google.maps.LatLng(lat, lng),
            });

            this.addHexbinLayer("./seattle-grid.json", map);

        }

        D3GoogleMap.prototype.setOpacity = function (opVal) {

            var hexagons = container.selectAll(".hexagon").data(bins);

            hexagons
                .attr("opacity", opVal.toFixed(1));

            // console.log(opVal.toFixed(1));
            // // heatmap.set('opacity', heatmap.get('opacity') ? null : opVal.toFixed(1));
            // heatmap.set('opacity', opVal.toFixed(1));
        }

        D3GoogleMap.prototype.addHexbinLayer = function (dataFile, map) {
            // Load the data. When the data comes back, create an overlay.
            d3.json(dataFile, function (data) {
                var overlay = new google.maps.OverlayView();

                // Add the container when the overlay is added to the map.
                overlay.onAdd = function () {
                    var layer = d3.select(this.getPanes().overlayLayer).append("div")
                        .attr("class", "points");

                    var svg = d3.select(this.getPanes().overlayLayer)
                        .append('svg')
                        .attr("class", "hex");

                    var levels = {};
                    var curLevel = false;


                    // Draw each marker as a separate SVG element.
                    // We could use a single SVG, but what size would it have?
                    overlay.draw = function () {
                        var projection = this.getProjection(),
                            padding = 10;

                        var marker = layer.selectAll("svg")
                            .data(d3.entries(data))
                            .each(transform) // update existing markers
                            .enter().append("svg:svg")
                            .each(transform)
                            .attr("class", "marker");

                        // // // Add a circle.
                        // marker.append("svg:circle")
                        //     .attr("r", 4.5)
                        //     .attr("cx", padding)
                        //     .attr("cy", padding);

                        // // Add a label.
                        // marker.append("svg:text")
                        //     .attr("x", padding + 7)
                        //     .attr("y", padding)
                        //     .attr("dy", ".31em")
                        //     .text(function (d) { return d.key; });

                        function transform(d) {
                            d = new google.maps.LatLng(d.value[1], d.value[0]);
                            d = projection.fromLatLngToDivPixel(d);
                            return d3.select(this)
                                .style("left", (d.x - padding) + "px")
                                .style("top", (d.y - padding) + "px");

                        }

                        var hexRadius = 6;
                        var hexPad = 100;
                        var hexbin = d3_hexbin.hexbin();
                        var layout = hexbin.radius(hexRadius);
                        // var layout = d3.hexbin().radius(hexRadius);
                        var rscale = d3.scale.sqrt().range([0, hexRadius]).clamp(true);
                        var cscale = d3.scale.linear().domain([0, 20]).range(["#00FF00", "#FFA500"]);
                        // var hexagons;

                        // Set default opacity to 0,5
                        function hexbinStyle(hexagons) {
                            hexagons
                                .attr("stroke", "rgba(0,0,0,0.5)")
                                .attr("stroke-width", "0.2px")
                                .attr("opacity", "0.5")
                                .attr("fill", function (d) {
                                    var avg = d3.median(d, function (d) {
                                        return 25;
                                    });
                                    return cscale(avg);
                                });
                        }

                        function genHexagons(container) {
                            var hexData = d3.entries(data).map(function (d) {
                                var latlng = new google.maps.LatLng(d.value[1], d.value[0]);
                                var px = projection.fromLatLngToDivPixel(latlng);
                                return [px.x, px.y, d];
                            }, this);

                            bins = layout(hexData);


                            var hexagons = container.selectAll(".hexagon").data(bins);

                            var counts = [];
                            bins.map(function (elem) { counts.push(elem.length); });

                            rscale.domain([0, (d3.mean(counts) + (d3.deviation(counts) * 3))]);

                            var path = hexagons.enter().append("path").attr("class", "hexagon");
                            hexbinStyle.call(this, path);

                            hexagons
                                .attr("d", function (d) {
                                    return layout.hexagon(hexRadius);
                                })
                                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
                        }

                        var zoom = map.getZoom();
                        var bounds = new google.maps.LatLngBounds();
                        d3.entries(data).map(function (d) {

                            var latlng = new google.maps.LatLng(d.value[1], d.value[0]);
                            bounds.extend(latlng);

                        });

                        var topRight = projection.fromLatLngToDivPixel(bounds.getNorthEast());
                        var bottomLeft = projection.fromLatLngToDivPixel(bounds.getSouthWest());

                        var sizeX = topRight.x - bottomLeft.x;
                        var sizeY = bottomLeft.y - topRight.y;

                        svg.attr('width', sizeX + (2 * hexPad))
                            .attr('height', sizeY + (2 * hexPad))
                            .style("margin-left", (bottomLeft.x - hexPad) + "px")
                            .style("margin-top", (topRight.y - hexPad) + "px");

                        if (!(zoom in levels)) {
                            levels[zoom] = svg.append("g").attr("class", "zoom-" + zoom);
                            container = levels[zoom];
                            genHexagons(levels[zoom]);
                            levels[zoom].attr("transform", "translate(" + -(bottomLeft.x - hexPad) + "," + -(topRight.y - hexPad) + ")");
                        }
                        if (curLevel) {
                            curLevel.style("display", "none");
                        }
                        curLevel = levels[zoom];
                        curLevel.style("display", "inline");

                    };
                };

                // Bind our overlay to the map…
                overlay.setMap(map);
            });
        }

        return D3GoogleMap;
    }());
    D3Mapping.D3GoogleMap = D3GoogleMap;
})(D3Mapping || (D3Mapping = {}));
