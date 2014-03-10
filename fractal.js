
function Fractal(_canvas) {
    var self = this;

    var step = 0;
    var canvas = _canvas;
    var context = canvas.getContext('2d');
    var scale = 0.5;
    var numSteps = 1;
    var pointSets = [];

    var getVectorLength = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    var normaliseVector = function (v) {
        var length = getVectorLength(v);
        if (length == 0)
            return { x: v.x, y: v.y };

        return {
            x: v.x / length,
            y: v.y / length
        }
    }

    var update = function () {
        var newPointSets = [];

        for (var i = 0; i < pointSets.length; ++i) {
            var points = pointSets[i];
            var newPoints = [];

            for (var j = 0; j < points.length - 1; ++j) {
                var start = { x: points[j].x, y: points[j].y };
                var end = { x: points[j + 1].x, y: points[j + 1].y };

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
                    x: mid.x + (dir.y * dist * scale),
                    y: mid.y + (-dir.x * dist * scale)
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

    var refresh = function (onComplete) {
        //points = [
        //    { x: canvas.width * 0.25, y: canvas.height * 0.25 },
        //    { x: canvas.width * 0.75, y: canvas.height * 0.25 },
        //    { x: canvas.width * 0.50, y: canvas.height * 0.75 }
        //];
        var px = function(x){ return canvas.width*x; };
        var py = function(y){ return canvas.height*y; };
        pointSets = [
            [
                { x: px(0.1), y: py(0.1) },
                { x: px(0.1), y: py(0.9) }
            ],
            [
                { x: px(0.1), y: py(0.5) },
                { x: px(0.9), y: py(0.5) }
            ],
            [
                { x: px(0.9), y: py(0.9) },
                { x: px(0.9), y: py(0.1) }
            ],
            [
                { x: px(0.1), y: py(0.1) },
                { x: px(0.9), y: py(0.1) },
                { x: px(0.5), y: py(0.9) },
                { x: px(0.1), y: py(0.1) }
            ],
        ];
        for (var i = 0; i < numSteps; ++i) {
            update();
        }

        if (onComplete)
            onComplete();
    };

    self.render = function () {

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < pointSets.length; ++i) {
            var points = pointSets[i];

            context.beginPath();

            var start = points[0];
            context.moveTo(start.x, start.y);

            for (var j = 1; j < points.length; ++j) {
                var p = points[j];
                context.lineTo(p.x, p.y);
            }
            context.stroke();

            //for (var j=0; j<points.length; ++j)
            //    context.fillRect(points[j].x-2.5, points[j].y-2.5, 5, 5);
        }
    };

    self.setScale = function (_scale, onComplete) {
        if (scale == _scale)
            return;

        scale = _scale;
        refresh(onComplete);
    };

    self.setSteps = function (_steps, onComplete) {
        if (numSteps == _steps)
            return;

        numSteps = _steps;
        refresh(onComplete);
    };

    refresh();
};