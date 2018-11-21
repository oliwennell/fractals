
function Fractal(_canvas) {
    var self = this;

    var canvas = _canvas;
    var context = canvas.getContext('2d');
    var numSteps = 5;
    var pointSets = [];

    var getVectorLength = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    var getSquaredVectorDistance = function(a, b) {
        var dx = Math.abs(a.x - b.x);
        var dy = Math.abs(a.y - b.y);
        return dx * dx + dy * dy;
    };

    var normaliseVector = function (v) {
        var length = getVectorLength(v);
        if (length == 0)
            return { x: v.x, y: v.y };

        return {
            x: v.x / length,
            y: v.y / length
        }
    };

    var getDistFromLineToPoint = function (lineA, lineB, point) {
        // http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

        function distToSegmentSquared(lineA, lineB, point) {
            var l2 = getSquaredVectorDistance(lineA, lineB);
            if (l2 == 0) return getSquaredVectorDistance(point, lineA);

            var t = ((point.x - lineA.x) * (lineB.x - lineA.x) + (point.y - lineA.y) * (lineB.y - lineA.y)) / l2;
            if (t < 0) return getSquaredVectorDistance(point, lineA);
            if (t > 1) return getSquaredVectorDistance(point, lineB);

            return getSquaredVectorDistance(point, {
                x: lineA.x + t * (lineB.x - lineA.x),
                y: lineA.y + t * (lineB.y - lineA.y)
            });
        }
        return Math.sqrt(distToSegmentSquared(lineA, lineB, point));
    }

    var update = function (center) {

        var newPointSets = [];

        for (var i = 0; i < pointSets.length; ++i) {
            var points = pointSets[i];
            var newPoints = [];

            for (var j = 0; j < points.length - 1; ++j) {
                var start = { x: points[j].x, y: points[j].y };
                var end = { x: points[j + 1].x, y: points[j + 1].y };

                var lineScale = ((canvas.width - getDistFromLineToPoint(start, end, center)) / canvas.width);
                lineScale = Math.pow(lineScale, 8);
                lineScale = Math.min(lineScale, 0.5);
                lineScale = lineScale * -1;

                var diff = {
                    x: end.x - start.x,
                    y: end.y - start.y
                };
                var dir = normaliseVector(diff);
                var dist = getVectorLength(diff);
                var mid = {
                    x: start.x + diff.x * 0.5,
                    y: start.y + diff.y * 0.5
                };
                var perp = {
                    x: mid.x + (dir.y * dist * lineScale),
                    y: mid.y + (-dir.x * dist * lineScale)
                };
                var pre = {
                    x: start.x + (dir.x * dist * 0.25),
                    y: start.y + (dir.y * dist * 0.25)
                };
                var post = {
                    x: start.x + (dir.x * dist * 0.75),
                    y: start.y + (dir.y * dist * 0.75)
                };

                newPoints.push(start);
                newPoints.push(pre);
                newPoints.push(perp);
                newPoints.push(post);
                newPoints.push(end);
            }
            newPointSets.push(newPoints);
        }
        pointSets = newPointSets;
    };

    self.refresh = function (center, onComplete) {
        var px = function(x){ return canvas.width*x; };
        var py = function (y) { return canvas.height * y; };

        pointSets = [
            [
                { x: px(0.2), y: py(0.2) },
                { x: px(0.2), y: py(0.4) },
                { x: px(0.2), y: py(0.6) },
                { x: px(0.2), y: py(0.8) },

                { x: px(0.4), y: py(0.8) },
                { x: px(0.6), y: py(0.8) },
                { x: px(0.8), y: py(0.8) },

                { x: px(0.8), y: py(0.6) },
                { x: px(0.8), y: py(0.4) },
                { x: px(0.8), y: py(0.2) },

                { x: px(0.6), y: py(0.2) },
                { x: px(0.4), y: py(0.2) },
                { x: px(0.2), y: py(0.2) }
            ]
        ];

        if (center) {
            for (var i = 0; i < numSteps; ++i) {
                update(center);
            }
        }

        if (onComplete)
            onComplete();
    };

    self.render = function () {

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < pointSets.length; ++i) {
            var points = pointSets[i];
            if (points.length == 0)
                continue;

            context.beginPath();

            var start = points[0];
            context.moveTo(start.x, start.y);

            for (var j = 1; j < points.length; ++j) {
                var p = points[j];
                context.lineTo(p.x, p.y);
            }
            context.stroke();
        }
    };

    self.refresh();
};

$(document).ready(function () {
    var canvas = document.getElementById('fractal-canvas');
    var fractal = new Fractal(canvas);

    $('#fractal-canvas')
        .mousemove(function (e) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            fractal.refresh({ x: x, y: y }, function () {
                fractal.render();
            });
        })
        .mouseleave(function (e) {
            fractal.refresh(null, function () {
                fractal.render();
            });
        });

    fractal.render();
});