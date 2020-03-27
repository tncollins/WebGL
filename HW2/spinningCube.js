var canvas;
var gl;

var NumVertices  = 36;
var locations = []; //saves the vectors of the click locations and random z for each square
thetas = []; //saves the angle of rotation for each square
deltaTheta = []; //saves the change of rotation for each angle

var xAxis = 0;
var yAxis = 0;
var zAxis = 1;
var index = 0;
var scale = .1;

var modelView;
var mvMatrix;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    canvas.addEventListener("mousedown", function(){

        console.log("mousedown x,y = ",event.clientX,"  ", event.clientY);

        var screenx = event.clientX - canvas.offsetLeft;
	    var screeny = event.clientY - canvas.offsetTop;
		  
		var posX = 2*screenx/canvas.width-1;
		var posY = 2*(canvas.height-screeny)/canvas.height-1;
		var posZ = Math.random()*0.1-0.1;  
        var t = vec3(posX, posY,posZ);

        //random angle of rotation and change in rotation for each square
        var theta = Math.random()*2 -1;
        thetas.push(theta);
        var dt=Math.random()*2-1;
        deltaTheta.push(dt);

         console.log("convert to clip coords",t);
         locations.push(t);

        index++;
    } );

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
	mvMatrix = mat4();
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        console.log("pressed x");
        xAxis = 1;
        yAxis = 0;
        zAxis = 0;
    };
    document.getElementById( "yButton" ).onclick = function () {
       console.log("pressed y");
       xAxis = 0;
       yAxis = 1;
       zAxis = 0;
    };
    document.getElementById( "zButton" ).onclick = function () {
        console.log("pressed z");
        xAxis = 0;
        yAxis = 0;
        zAxis = 1;
    };
    document.getElementById( "rButton" ).onclick = function () {
        console.log("pressed rotate random axis");
        xAxis = Math.random()+1;
        yAxis = Math.random()+1;
        zAxis = Math.random()+1;
    };

    document.getElementById("slider").onchange = function() {
        scale = 0 + event.srcElement.value;
		console.log("scale = ",scale);
    };
        
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var i = 0;i<index;i++)
    {
        mvMatrix = mult(translate(locations[i]),scalem(scale,scale,scale));
        thetas[i] += deltaTheta[i]; //each cube has its own theta and change in rotation. increment theta by the change
        mvMatrix = mult(mvMatrix, rotate(thetas[i], xAxis, yAxis, zAxis));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    }
    

    requestAnimFrame( render );
}