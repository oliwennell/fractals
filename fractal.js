
function Fractal(_canvas) {
    var self = this;

    var step = 0;
    var canvas = _canvas;
    var context = canvas.getContext('2d');
    var scale = 0.5;
    var numSteps = 1;

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
        var newPoints = [];
        for (var i = 0; i < points.length; ++i) {
            var start = points[i];
            var end = points[(i + 1) % points.length];

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
                x: mid.x + (dir.y*dist*0.25),
                y: mid.y + (-dir.x*dist*0.25)
            };
            var pre = {
                x: start.x + (dir.x * dist * scale),
                y: start.y + (dir.y * dist * scale)
            };
            var post = {
                x: end.x - (dir.x * dist * scale),
                y: end.y - (dir.y * dist * scale)
            };

            newPoints.push(start);
            newPoints.push(pre);
            newPoints.push(perp);
            newPoints.push(post);
            newPoints.push(end);
        }
        points = newPoints;
    };

    var refresh = function (onComplete) {
        points = [
            { x: canvas.width * 0.25, y: canvas.height * 0.25 },
            { x: canvas.width * 0.75, y: canvas.height * 0.25 },
            { x: canvas.width * 0.50, y: canvas.height * 0.75 }
        ];
        for (var i = 0; i < numSteps; ++i) {
            update();
        }

        if (onComplete)
            onComplete();
    };

    self.render = function () {

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();

        var start = points[0];
        context.moveTo(start.x, start.y);

        for (var i = 1; i <= points.length; ++i) {
            var p = points[i % points.length];
            context.lineTo(p.x, p.y);
        }

        context.stroke();
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