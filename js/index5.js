window.onload = function () {
    //顶点着色
    var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TextCoord;
    varying vec2 v_TextCoord;
    void main(){
        gl_Position = a_Position;
        v_TextCoord = a_TextCoord;
    }
    `;
    //片元着色
    var FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TextCoord;
    void main(){
        gl_FragColor = texture2D(u_Sample, v_TextCoord);
    }
    `;
    //获取canvas
    var vanvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed');
        return;
    }

    //编译着色器
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, VSHADER_SOURCE);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, FSHADER_SOURCE);
    gl.compileShader(fragShader);

    //合并程序
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var n = initBuffers(gl, shaderProgram);

    //doTranslate(gl, shaderProgram);
    //doRotate(gl, shaderProgram);
    doScale(gl, shaderProgram);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    
    function doRotate(gl, shaderProgram){
        var angle = 45;
        var sinB = Math.sin(Math.PI*angle/180.0);
        var cosB = Math.cos(Math.PI*angle/180.0);
        var xformMatrix = new Float32Array([
            cosB, sinB, 0, 0,
            -sinB, cosB, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        var u_xformMatarix = gl.getUniformLocation(shaderProgram, 'u_xformMatarix');
        gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);
    }

    function doScale(){
        var sx = 0.5, sy = 0.5;
        var xformMatrix = new Float32Array([
            sx, 0, 0, 0, 
            0, sy, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        var u_xformMatarix = gl.getUniformLocation(shaderProgram, 'u_xformMatarix');
        gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);
    }

    function doTranslate(gl, shaderProgram){
        var tx = 0.5, ty = 0.5, tz = 0;
        var xformMatrix = new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            tx, ty, tz, 1.0
        ]);
        var u_xformMatarix = gl.getUniformLocation(shaderProgram, 'u_xformMatarix');
        gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);
    }

    function initBuffers(gl, shaderProgram){
        var vertices = new Float32Array([
            -0.5, 0.5, 0, 1,
            -0.5, -0.5, 0, 0,
            0.5, 0.5, 1, 1,
            0.5, -0.5, 1, 0
        ]);
        var n = 4;
        //创建缓冲区对象
        var vertextBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
        //向缓冲区写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
        //将缓冲区对象分配给attribute对象
        var FSIZE = vertices.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
        gl.enableVertexAttribArray(a_Position);

        var a_TextCoord = gl.getAttribLocation(shaderProgram, 'a_TextCoord');
        gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
        gl.enableVertexAttribArray(a_TextCoord);
        return n;
    }
    function initTexture(gl, shaderProgram, n){
        var texture = gl.createTexture();
        var u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');
        var image = new Image();
        image.onload = function(){
            loadTexture(gl, n, texture, u_Sampler, image);
        }
        image.src = 'assets/11.jpg';
        return true;
    }

    function loadTexture(g, n, texture, u_Sampler, image){

    }
}