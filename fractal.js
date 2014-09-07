
function Fractal(_canvas) {
    var self = this;

    var Vector = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.magnitude = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        this.normalise = function() {
            var length = this.magnitude();
            if (length == 0)
                return new Vector(this.x, this.y);

            return new Vector(this.x / length, this.y / length);
        };
        this.subtract = function(other) {
            return new Vector(this.x - other.x, this.y - other.y);
        };
    };

    var Node = function() {
        this.pos = new Vector();
        this.prev = null;
        this.children = []; 
    };


    var canvas = _canvas;
    var context = canvas.getContext('2d');
    
    var root = new Node();
    var depth = 0;

    var generateNode = function(prevNode, prevDir) {

        if (depth > 6)
            return;

        depth++;

        var prevLength = prevDir.magnitude();
                    
        var newLength = prevLength * 0.666;
        //var newLength = prevLength * 0.25 * depth;
        var newV = new Vector(
            prevNode.pos.x + ((Math.random() - 0.5) * newLength) * (depth*0.2),
            prevNode.pos.y + (Math.max(0.2, Math.random() * 0.75) * newLength) * (depth*0.15)
        );
        var newDir = newV.subtract(prevNode.pos).normalise();
        var newNode = new Node();
        newNode.pos.x = prevNode.pos.x + (newDir.x * newLength);
        newNode.pos.y = prevNode.pos.y - (newDir.y * newLength);

        //console.log(depth + ' ' + newNode.pos.x + ':' + newNode.pos.y);
        prevNode.children.push(newNode);        

        prevDir = newNode.pos.subtract(prevNode.pos);
        for (var leaf = 0; leaf < Math.max(1, Math.random()*depth*1.75); ++leaf)
            generateNode(newNode, prevDir);

        depth--;
    }

    var update = function () {

        rootNode = new Node();

        var px = function(x) { return canvas.width * x; };
        var py = function (y) { return canvas.height * y; };
        rootNode.pos = new Vector(px(0.5), py(0.5))

        depth = 0;
        var prevNode = rootNode;
        var prevDir = new Vector(0, -150);
        generateNode(prevNode, prevDir);
    };

    self.refresh = function (onComplete) {
        update();

        if (onComplete)
            onComplete();
    };

    var renderNode = function(node) {
        for (var childIndex = 0; childIndex < node.children.length; ++childIndex) {
            var child = node.children[childIndex];
            context.beginPath();
            context.moveTo(node.pos.x, node.pos.y);
            context.lineTo(child.pos.x, child.pos.y);
            context.stroke();

            renderNode(child);
        }
    };

    self.render = function () {

        context.clearRect(0, 0, canvas.width, canvas.height);

        renderNode(rootNode);
    };

    self.refresh();
};

$(document).ready(function () {
    var canvas = document.getElementById('fractal-canvas');
    var fractal = new Fractal(canvas);
    fractal.render();
});