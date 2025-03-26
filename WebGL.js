//This tempalte is just for your reference
//You do not have to follow this template 
//You are very welcome to write your program from scratch

//shader
var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        void main(){
            gl_Position = a_Position;
            gl_PointSize = 5.0;
            v_Color = a_Color;
        }  
    `;

var FSHADER_SOURCE = `
        precision mediump float;
        varying vec4 v_Color;
        void main(){
            gl_FragColor = v_Color;
        }
    `;



var shapeFlag = 'p'; //p: point, h: hori line: v: verti line, t: triangle, q: square, c: circle
var colorFlag = 'r'; //r g b 
var a_Position;
var a_Color;
var v_points = [];
var v_horiLines = [];
var v_vertiLines = [];
var v_triangles = [];
var v_squares = [];
var v_circles = [];
var triangle_size = 40;
var square_size = 40;
var circle_radius = 50;
//var ... of course you may need more variables

function main(){
    //////Get the canvas context
    canvas = document.getElementById('webgl');
    // var gl = canvas.getContext('webgl') || canvas.getContext('exprimental-webgl') ;
    gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return ;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Failed to initialize shaders');
        return ;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');



    // compile shader and use program
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // mouse and key event...
    canvas.onmousedown = function(ev){click(ev)};
    document.onkeydown = function(ev){keydown(ev)};
}



function keydown(ev){ //you may want to define more arguments for this function
    //implment keydown event here

    if(ev.key == 'r'){ //an example for user press 'r'... 
        colorFlag = 'r';
    }else if(ev.key == 'g'){
        colorFlag = 'g';
    }else if(ev.key == 'b'){
        colorFlag = 'b';
    }else if(ev.key == 'p'){
        shapeFlag = 'p';
    }else if(ev.key == 'h'){   
        shapeFlag = 'h';
    }else if(ev.key == 'v'){
        shapeFlag = 'v';
    }else if(ev.key == 't'){
        shapeFlag = 't';
    }else if(ev.key == 'q'){
        shapeFlag = 'q';
    }else if(ev.key == 'c'){
        shapeFlag = 'c';
    }
}

function click(ev){ //you may want to define more arguments for this function
    //mouse click: recall our quiz1 in calss
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2)
    y = (canvas.width/2 - (y - rect.top))/(canvas.height/2)

    //you might want to do something here
    switch(shapeFlag){
        case 'p':
            add(x, y, colorFlag, v_points);
            break;
        case 'h':
            add(x, y, colorFlag, v_horiLines);
            break;
        case 'v':
            add(x, y, colorFlag, v_vertiLines);
            break;
        case 't':
            add(x, y, colorFlag, v_triangles);
            break;
        case 'q':
            add(x, y, colorFlag, v_squares);
            break;
        case 'c':
            add(x, y, colorFlag, v_circles);
            break;   
    }

    //self-define draw() function
    //I suggest that you can clear the canvas
    //and redraw whole frame(canvas) after any mouse click
    draw();
}

function add(x, y, color, array){
    if(array.length < 5){
        array.push([x, y, color]);
    }else{
        array.shift();
        array.push([x, y, color]);
    }
}


function draw(){ //you may want to define more arguments for this function
    //redraw whole canvas here
    //Note: you are only allowed to same shapes of this frame by single gl.drawArrays() call
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw points
    if(v_points.length != 0){
        let vertexBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        let vertices = new Float32Array(v_points.length * 2);
        let colors = new Float32Array(v_points.length * 4);
        for(var i = 0; i < v_points.length; i++){
            vertices[i*2] = v_points[i][0];
            vertices[i*2+1] = v_points[i][1];
            colors[i*4] = v_points[i][2] == 'r' ? 1.0 : 0.0;
            colors[i*4+1] = v_points[i][2] == 'g' ? 1.0 : 0.0;
            colors[i*4+2] = v_points[i][2] == 'b' ? 1.0 : 0.0;
            colors[i*4+3] = 1.0; // alpha
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.drawArrays(gl.POINTS, 0, v_points.length);
    }

    // draw horiLines
    if(v_horiLines.length != 0){
        let vertexBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        let vertices = new Float32Array(v_horiLines.length * 4);
        let colors = new Float32Array(v_horiLines.length * 8);

        for(let i = 0;i < v_horiLines.length; i++){
            vertices[i*4] = -1.0;
            vertices[i*4+1] = v_horiLines[i][1];
            vertices[i*4+2] = 1.0;
            vertices[i*4+3] = v_horiLines[i][1];

            colors[i*8] = v_horiLines[i][2] == 'r' ? 1.0 : 0.0;
            colors[i*8+1] = v_horiLines[i][2] == 'g' ? 1.0 : 0.0;
            colors[i*8+2] = v_horiLines[i][2] == 'b' ? 1.0 : 0.0;
            colors[i*8+3] = 1.0;
            colors[i*8+4] = v_horiLines[i][2] == 'r' ? 1.0 : 0.0;
            colors[i*8+5] = v_horiLines[i][2] == 'g' ? 1.0 : 0.0;
            colors[i*8+6] = v_horiLines[i][2] == 'b' ? 1.0 : 0.0;
            colors[i*8+7] = 1.0;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.drawArrays(gl.LINES, 0, v_horiLines.length * 2);
    }

    // draw vertiLines
    if(v_vertiLines.length != 0){
        let vertexBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        let vertices = new Float32Array(v_vertiLines.length * 4);
        let colors = new Float32Array(v_vertiLines.length * 8);

        for(let i = 0;i < v_vertiLines.length; i++){
            vertices[i*4] = v_vertiLines[i][0];
            vertices[i*4+1] = -1.0;
            vertices[i*4+2] = v_vertiLines[i][0];
            vertices[i*4+3] = 1.0;

            colors[i*8] = v_vertiLines[i][2] == 'r' ? 1.0 : 0.0;
            colors[i*8+1] = v_vertiLines[i][2] == 'g' ? 1.0 : 0.0;
            colors[i*8+2] = v_vertiLines[i][2] == 'b' ? 1.0 : 0.0;
            colors[i*8+3] = 1.0;
            colors[i*8+4] = v_vertiLines[i][2] == 'r' ? 1.0 : 0.0;
            colors[i*8+5] = v_vertiLines[i][2] == 'g' ? 1.0 : 0.0;
            colors[i*8+6] = v_vertiLines[i][2] == 'b' ? 1.0 : 0.0;
            colors[i*8+7] = 1.0;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.drawArrays(gl.LINES, 0, v_vertiLines.length * 2);
    }

    // draw traingles
    if(v_triangles.length != 0){
        let vertexBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        let vertices = new Float32Array(v_triangles.length * 6);
        let colors = new Float32Array(v_triangles.length * 12);
        let d = traingle_side / (canvas.height/2.0);
        

        for(let i = 0;i < v_triangles.length; i++){
            let x = v_triangles[i][0];
            let y = v_triangles[i][1];

            // traingle vertex
            vertices[i * 6] = x;
            vertices[i * 6 + 1] = y + d * Math.sqrt(3.0) / 3.0;
            vertices[i * 6 + 2] = x - d / 2.0;
            vertices[i * 6 + 3] = y - d * Math.sqrt(3.0) / 6.0;
            vertices[i * 6 + 4] = x + d / 2.0;
            vertices[i * 6 + 5] = y - d * Math.sqrt(3.0) / 6.0;

            for(let j = 0;j < 3;j++){
                colors[i*12+4*j] = v_triangles[i][2] == 'r' ? 1.0 : 0.0;
                colors[i*12+1+4*j] = v_triangles[i][2] == 'g' ? 1.0 : 0.0;
                colors[i*12+2+4*j] = v_triangles[i][2] == 'b' ? 1.0 : 0.0;
                colors[i*12+3+4*j] = 1.0;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.drawArrays(gl.TRIANGLES, 0, v_triangles.length * 3);
    } 
}

function initShaders(gl, vshaderSource, fshaderSource) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vshaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fshaderSource);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Could not link shaders");
        return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
}

