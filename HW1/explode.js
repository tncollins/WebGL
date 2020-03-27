//
//CSE 470 HW 1 Explode!  
//
/*
Written by: Taylor Collins
Date: Feb 2020

Description: 
This program sends 4 objects away from the core along 4 different vectors
and changes the color to white as it moves away from the core.
This is done using a translation vector and the a variable that controls the
rate at which it changes(KFT). In the vertex shader, the translation vector is 
multiplied by the KFT and added to the position vector of the vertices. This moves
each triangle along the vector assigned to it. The translation vectors were chosen
by setting the x and y values to the maximum x and y I wanted them to reach. 
To control the color, the vector (2,2,2) is multipled by the KFT. 
This is because the max KFT for my design is 0.5, and (2,2,2)*.5 would result in (1,1,1) 
being added to the color vectors, turning each of the exploding shapesto white. 
The KFT value for the core is always set to zero, because it is not changing. 
*/

var canvas;
var gl;

//store the vertices
//Each triplet represents one triangle
var vertices = [];

//store a color for each vertex
var colors = [];

//HW470: control the explosion
//(Your variables here)
var travel;//translation vector that objects will travel on
var KFT;
var newColor;//color vector that will be used to change color in the shader
var step = 0.1;
var start = 0.0;

var final = 0.5;

//HW470: control the redraw rate
var delay = 250;

// =============== function init ======================
 
// When the page is loaded into the browser, start webgl stuff
window.onload = function init()
{
	// notice that gl-canvas is specified in the html code
    canvas = document.getElementById( "gl-canvas" );
    
	// gl is a canvas object
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Track progress of the program with print statement
    console.log("Opened canvas");
        
    //HW470:
    // Define  data for object 
	// See HW specs for number of vertices and parts required
	// Recommendation: each set of three points corresponds to a triangle.
	// DCH: I have used sval for scaling the object size if I am not
	// happy with my initial design. (Just an idea for you; no need to use.)
	//(During the explosion all geometry must remain in the window.)
    //
	var sval = 0.25;
    vertices = [
        // vec2( sval, -sval ),// core
        // vec2( 0.0, sval ),
        // vec2( -sval, -sval )

        //left half
        vec2(-0.125,0.2),vec2(-0.225,0.24),vec2(-0.3,0.2),
        vec2(-0.35,0.1),vec2(-0.125,0.2),vec2(-0.3,0.2),
        vec2(-0.3,-0.05),vec2(-0.125,0.2),vec2(-0.35,0.1),
        vec2(-0.05,0.15),vec2(-0.125,0.2),vec2(-0.3,-0.05),
        vec2(-0.2,-0.15),vec2(-0.05,0.15),vec2(-0.3,-0.05),
        vec2(0,0.1),vec2(-0.05,0.15),vec2(-0.2,-0.15),
        vec2(-0.1,-0.25),vec2(0,0.1),vec2(-0.2,-0.15),
        vec2(0,-0.35),vec2(0,0.1),vec2(-0.1,-0.25),

        //right half
        vec2(0.125,0.2),vec2(0.225,0.24),vec2(0.3,0.2),
        vec2(0.35,0.1),vec2(0.125,0.2),vec2(0.3,0.2),
        vec2(0.3,-0.05),vec2(0.125,0.2),vec2(0.35,0.1),
        vec2(0.05,0.15),vec2(0.125,0.2),vec2(0.3,-0.05),
        vec2(0.2,-0.15),vec2(0.05,0.15),vec2(0.3,-0.05),
        vec2(0,0.1),vec2(0.05,0.15),vec2(0.2,-0.15),
        vec2(0.1,-0.25),vec2(0,0.1),vec2(0.2,-0.15),
        vec2(0,-0.35),vec2(0,0.1),vec2(0.1,-0.25),


        //arrow 1
        vec2(-0.4,0.2), vec2(-0.25,0.34), vec2(-0.4,0.35),
        vec2(-0.3,0.2),vec2(-0.29,0.305),vec2(-0.35,0.25),
        vec2(-0.3,0.2),vec2(-0.225,0.24),vec2(-0.29,0.3),

       //arrow 2
        vec2(-0.25,-0.2), vec2(-0.1,-0.35), vec2(-0.25,-0.35),
        vec2(-0.15,-0.3),vec2(-0.15,-0.2),vec2(-0.2,-0.25),
        vec2(-0.15,-0.3),vec2(-0.1,-0.25),vec2(-0.15,-0.2),

        //arrow 3
        vec2(0.4,0.2), vec2(0.25,0.34), vec2(0.4,0.35),
        vec2(0.3,0.2),vec2(0.29,0.305),vec2(0.35,0.25),
        vec2(0.3,0.2),vec2(0.225,0.24),vec2(0.29,0.3),

        //arrow 4
        vec2(0.25,-0.2), vec2(0.1,-0.35), vec2(0.25,-0.35),
        vec2(0.15,-0.3),vec2(0.15,-0.2),vec2(0.2,-0.25),
        vec2(0.15,-0.3),vec2(0.1,-0.25),vec2(0.15,-0.2),

    ];
	 
	
	//HW470: Create colors for the core and outer parts
	// See HW specs for the number of colors needed
	for(var i=0; i < 48; i++) {//core color
		colors.push(vec3(1.0, 0.0, 0.0));
    };
    
    for(var i=48; i < 57; i++) {//arrow 1
		colors.push(vec3(1.0, 0.0, 1.0));
	};
	 
	for(var i=57; i < 66; i++) {//arrow 2
		colors.push(vec3(0.0, 1.0, 0.0));
    };
    
    for(var i=66; i < 75; i++) {//arrow 3
		colors.push(vec3(1.0, 1.0, 0.0));
    };
    
    for(var i=48; i < this.vertices.length; i++) { //arrow 4
		colors.push(vec3(0.0, 0.5, 0.5));
	};
	
	
	// HW470: Print the input vertices and colors to the console
	console.log("Input vertices and colors:");
    console.log(this.vertices);
    console.log(colors);
	 

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	// Background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Define shaders to use  
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    

    // Load the data into the GPU
	//
	// color buffer: create, bind, and load
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	// Associate shader variable for  r,g,b color
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // vertex buffer: create, bind, load
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables for x,y vertices	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
    //HW470: associate shader explode variable ("Loc" variables defined here)
    travel = gl.getUniformLocation( program, "travel" );//location of translation vector
    KFT = gl.getUniformLocation(program,"KFT");//location of variable to control explosion
    newColor = gl.getUniformLocation(program, "newColor");//location of color changing vector

    console.log("Data loaded to GPU -- Now call render");

    render();
};


// =============== function render ======================

function render()
{
    // clear the screen 
    gl.clear( gl.COLOR_BUFFER_BIT );
	
    //HW470: send uniform(s) to vertex shader
    //set uniforms for the core
    gl.uniform1f(KFT,0);
    gl.uniform4f(travel,-0.8,0.8,0.0,1.0);
    gl.uniform3f(newColor,1.0,1.0,1.0);


	
	//HW470: draw the object
	// You will need to change this to create the exploding outer parts effect
    // Hint: you will need more than one draw function call
    
    //draws cores
    gl.drawArrays(gl.TRIANGLES,0,48);
    
    if(start > final) // resets the explosion back to its starting position
    {
        start = 0.0;
    }


    //draws arrow 1
    gl.uniform1f(KFT,start);
    gl.uniform4f(travel,-0.8,0.7,0.0,1.0);
    gl.uniform3f(newColor,0.0,2.0,2.0);
    gl.drawArrays(gl.TRIANGLES,48,9);

    //draws arrow 2
    gl.uniform1f(KFT,start);
    gl.uniform4f(travel,-0.8,-0.7,0.0,1.0);
    gl.uniform3f(newColor,2.0,0.0,2.0);
    gl.drawArrays(gl.TRIANGLES,57,9);

    //draws arrow 3
    gl.uniform1f(KFT,start);
    gl.uniform4f(travel,0.8,0.7,0.0,1.0);
    gl.uniform3f(newColor,0.0,0.0,2.0);
    gl.drawArrays(gl.TRIANGLES,66,9);

    //draws arrow 4
    gl.uniform1f(KFT,start);
    gl.uniform4f(travel,0.8,-0.7,0.0,1.0);
    gl.uniform3f(newColor,2.0,2.0,2.0);
    gl.drawArrays(gl.TRIANGLES,75,9);

    start += step;
    
	//re-render after delay
	setTimeout(function (){requestAnimFrame(render);}, delay);
}

