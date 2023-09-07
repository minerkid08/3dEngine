alert("g");
let debug = document.getElementById("debug");
let keys = {};
class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 1; 
    }
    normalize() {
        let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x /= l;
        this.y /= l;
        this.z /= l;
    }
    add(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(f) {
        return new vec3(this.x * f, this.y * f, this.z * f);
    }
    div(f) {
        return new vec3(this.x / f, this.y / f, this.z / f);
    }
    mulVec(v) {
        return new vec3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    divVec(v) {
        return new vec3(this.x / v.x, this.y / v.y, this.z / v.z);
    }
    crossProd(v) {
        let o = new vec3();
        o.x = this.y * v.z - this.z * v.y;
        o.y = this.z * v.x - this.x * v.z;
        o.z = this.x * v.y - this.y * v.x;
        return o;
    }
    dotProd(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Triangle {
    constructor() {
        this.pts = [];
    }
    addTri(t) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].add(t.pts[0]);
        o.pts[1] = this.pts[1].add(t.pts[1]);
        o.pts[2] = this.pts[2].add(t.pts[2]);
        return o;
    }
    subTri(t) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].sub(t.pts[0]);
        o.pts[1] = this.pts[1].sub(t.pts[1]);
        o.pts[2] = this.pts[2].sub(t.pts[2]);
        return o;
    }
    addVec(t) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].add(t);
        o.pts[1] = this.pts[1].add(t);
        o.pts[2] = this.pts[2].add(t);
        return o;
    }
    subVec(t) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].sub(t);
        o.pts[1] = this.pts[1].sub(t);
        o.pts[2] = this.pts[2].sub(t);
        return o;
    }
    mul(f) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].mul(f);
        o.pts[1] = this.pts[1].mul(f);
        o.pts[2] = this.pts[2].mul(f);
        return o;
    }
    div(f) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].div(f);
        o.pts[1] = this.pts[1].div(f);
        o.pts[2] = this.pts[2].div(f);
        return o;
    }
    mulVec(f) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].mulVec(f);
        o.pts[1] = this.pts[1].mulVec(f);
        o.pts[2] = this.pts[2].mulVec(f);
        return o;
    }
    divVec(f) {
        let o = new Triangle();
        o.pts[0] = this.pts[0].mulVec(f);
        o.pts[1] = this.pts[1].mulVec(f);
        o.pts[2] = this.pts[2].mulVec(f);
        return o;
    }
}

class Mesh {
    constructor() {
        this.tris = [];
        this.pts = [];

        this.pos = new vec3(-0.5,-0.5,-0.5);

        this.col = new Color(0, 0.75, 0);
    }
}

class Mat4x4 {
    constructor() {
        this.m = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    }
    mulVec3(v) {
        let o = new vec3();
        o.x = v.x * this.m[0][0] + v.y * this.m[1][0] + v.z * this.m[2][0] + v.w * this.m[3][0];
        o.y = v.x * this.m[0][1] + v.y * this.m[1][1] + v.z * this.m[2][1] + v.w * this.m[3][1];
        o.z = v.x * this.m[0][2] + v.y * this.m[1][2] + v.z * this.m[2][2] + v.w * this.m[3][2];
        o.w = v.x * this.m[0][3] + v.y * this.m[1][3] + v.z * this.m[2][3] + v.w * this.m[3][3];
        return o;
    }
    mulTri(t) {
        let o = new Triangle();
        o.pts[0] = this.mulVec3(t.pts[0]);
        o.pts[1] = this.mulVec3(t.pts[1]);
        o.pts[2] = this.mulVec3(t.pts[2]);
        return o;
    }
    mulMat(m) {
        let o = new Mat4x4();
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                o.m[x][y] = this.m[x][0] * m.m[0][y] + this.m[x][1] * m.m[1][y] + this.m[x][2] * m.m[2][y] + this.m[x][3] * m.m[3][y];
            }
        }
        return o;
    }
    inverse() {
        let m = new Mat4x4();
        m.m[0][0] = this.m[0][0];
        m.m[0][1] = this.m[1][0];
        m.m[0][2] = this.m[2][0];
        m.m[0][3] = 0;

        m.m[1][0] = this.m[0][1];
        m.m[1][1] = this.m[1][1];
        m.m[1][2] = this.m[2][1];
        m.m[1][3] = 0;

        m.m[2][0] = this.m[0][2];
        m.m[2][1] = this.m[1][2];
        m.m[2][2] = this.m[2][2];
        m.m[2][3] = 0;

        m.m[3][0] = -(this.m[3][0] * m.m[0][0] + this.m[3][1] * m.m[1][0] + this.m[3][2] * m.m[2][0]);
        m.m[3][1] = -(this.m[3][0] * m.m[0][1] + this.m[3][1] * m.m[1][1] + this.m[3][2] * m.m[2][1]);
        m.m[3][2] = -(this.m[3][0] * m.m[0][2] + this.m[3][1] * m.m[1][2] + this.m[3][2] * m.m[2][2]);
        m.m[3][3] = 1;
        return m;
    }
    static idenity() {
        let m = new Mat4x4();
        m.m[0][0] = 1;
        m.m[1][1] = 1;
        m.m[2][2] = 1;
        m.m[3][3] = 1;
        return m;
    }
    static rotX(ang) {
        let m = new Mat4x4();
        m.m[0][0] = 1;
        m.m[1][1] = Math.cos(ang);
        m.m[1][2] = Math.sin(ang);
        m.m[2][1] = -Math.sin(ang);
        m.m[2][2] = Math.cos(ang);
        m.m[3][3] = 1;
        return m;
    }
    static rotY(ang) {
        let m = new Mat4x4();
        m.m[0][0] = Math.cos(ang);
        m.m[0][2] = Math.sin(ang);
        m.m[2][0] = -Math.sin(ang);
        m.m[1][1] = 1;
        m.m[2][2] = Math.cos(ang);
        m.m[3][3] = 1;
        return m;
    }
    static rotZ(ang) {
        let m = new Mat4x4();
        m.m[0][0] = Math.cos(ang);
        m.m[0][1] = Math.sin(ang);
        m.m[1][0] = -Math.sin(ang);
        m.m[1][1] = Math.cos(ang);
        m.m[2][2] = 1;
        m.m[3][3] = 1;
        return m;
    }
    static translation(v) {
        let m = new Mat4x4();
        m.m[0][0] = 1;
        m.m[1][1] = 1;
        m.m[2][2] = 1;
        m.m[3][3] = 1;
        m.m[3][0] = v.x;
        m.m[3][1] = v.y;
        m.m[3][2] = v.z;
        return m;
    }
    static proj(fov, aspect, near, far) {
        let fovRad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);
        let m = new Mat4x4();
        m.m[0][0] = aspect * fovRad;
        m.m[1][1] = fovRad;
        m.m[2][2] = far / (far - near);
        m.m[3][2] = (-far * near) / (far - near);
        m.m[2][3] = 1.0;
        m.m[3][3] = 0;
        return m; 
    }
    static pointAt(pos, target, up_) {
        let forward = target.sub(pos);
        forward.normalize();
        let a = forward.mul(up_.dotProd(forward));
        let up = up_.sub(a);
        up.normalize();
        let right = up.crossProd(forward);

        let m = new Mat4x4();
        m.m[0][0] = right.x;
        m.m[0][1] = right.y;
        m.m[0][2] = right.z;
        m.m[0][3] = 0;

        m.m[1][0] = up.x;
        m.m[1][1] = up.y;
        m.m[1][2] = up.z;
        m.m[1][3] = 0;

        m.m[2][0] = forward.x;
        m.m[2][1] = forward.y;
        m.m[2][2] = forward.z;
        m.m[2][3] = 0;

        m.m[3][0] = pos.x;
        m.m[3][1] = pos.y;
        m.m[3][2] = pos.z;
        m.m[3][3] = 1;
        return m;
    }
}

class Engine {
    constructor() {
        this.mesh = [];
        this.matProj = new Mat4x4();
        this.camera = new vec3(0, 0, 0);
        this.cameraDir = new vec3(0, 0, 0);
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.fTheta = 0;
        this.cAngle = new vec3(0,0,0);
        this.FillMode = {
            shaded: Symbol("shaded"),
            shadedWireframe: Symbol("shadedWireframe"),
            wireframe: Symbol("wireframe")
        };
        this.drawMode = this.FillMode.shaded;
        this.drawHidden = false;

        //cube
        let mesh1 = new Mesh();
        mesh1.pts = [
            new vec3(0,0,0), new vec3(0,1,0), new vec3(1,1,0), new vec3(1,0,0), 
            new vec3(0,0,1), new vec3(0,1,1), new vec3(1,1,1), new vec3(1,0,1)
        ];
        mesh1.tris = [
            [0,1,2], [0,2,3],
            [3,2,6], [3,6,7],
            [7,6,5], [7,5,4],
            [4,5,1], [4,1,0],
            [1,5,6], [1,6,2],
            [7,4,0], [7,0,3]
        ];
        mesh1.col = new Color(0.5,0,0);

        //prymid

        //this.meshCube.pts = [new vec3(0,0,0), new vec3(1,0,0), new vec3(1,1,0), new vec3(0,1,0), new vec3(0.5,0.5,1)];
        //this.meshCube.tris = [[0,3,2],[0,2,1],[4,3,0],[4,2,3],[4,1,2],[4,0,1]];

        //prymid on cube
        let mesh2 = new Mesh();
        mesh2.pts = [
            new vec3(0, 0, 4), new vec3(0, 1, 4), new vec3(1, 1, 4), new vec3(1, 0, 4),
            new vec3(0, 0, 5), new vec3(0, 1, 5), new vec3(1, 1, 5), new vec3(1, 0, 5), new vec3(0.5, 0.5, 5.75)
        ];
        mesh2.tris = [
            [0, 1, 2], [0, 2, 3],
            [3, 2, 6], [3, 6, 7],
            [4, 5, 1], [4, 1, 0],
            [1, 5, 6], [1, 6, 2],
            [7, 4, 0], [7, 0, 3],
            [8, 7, 6], [8, 4, 7],
            [8, 5, 4], [8, 6, 5]
        ];
        //this.mesh.push(mesh2);
        //this.mesh.push(mesh1);

        let axis = new Mesh();

        axis.pts = [
            new vec3(-11.748000, -0.360000, 1.268000),
            new vec3(-11.276000, -0.360000, 1.268000),
            new vec3(-10.424000, -0.360000, 0.228000),
            new vec3(-9.568000, -0.360000, 1.268000),
            new vec3(-9.092000, -0.360000, 1.268000),
            new vec3(-10.184000, -0.360000, -0.048000),
            new vec3(-9.008000, -0.360000, -1.460000),
            new vec3(-9.484000, -0.360000, -1.460000),
            new vec3(-10.424000, -0.360000, -0.332000),
            new vec3(-11.352000, -0.360000, -1.460000),
            new vec3(-11.824000, -0.360000, -1.460000),
            new vec3(-10.660000, -0.360000, -0.048000),
            new vec3(-9.484000, 0.373033, -1.460000),
            new vec3(-10.424000, 0.373033, -0.332000),
            new vec3(-11.748000, 0.373033, 1.268000),
            new vec3(-10.660000, 0.373033, -0.048000),
            new vec3(-9.568000, 0.373033, 1.268000),
            new vec3(-10.184000, 0.373033, -0.048000),
            new vec3(-11.824000, 0.373033, -1.460000),
            new vec3(-9.008000, 0.373033, -1.460000),
            new vec3(-10.424000, 0.373033, 0.228000),
            new vec3(-11.352000, 0.373033, -1.460000),
            new vec3(-9.092000, 0.373033, 1.268000),
            new vec3(-11.276000, 0.373033, 1.268000),
            new vec3(-0.620000, -0.380000, 11.376000),
            new vec3(1.116000, -0.380000, 9.000000),
            new vec3(-1.344000, -0.380000, 9.000000),
            new vec3(-1.344000, -0.380000, 9.352000),
            new vec3(0.392000, -0.380000, 9.352000),
            new vec3(-1.344000, -0.380000, 11.728000),
            new vec3(1.008000, -0.380000, 11.728000),
            new vec3(1.008000, -0.380000, 11.376000),
            new vec3(0.392000, 0.384923, 9.352000),
            new vec3(-1.344000, 0.384923, 11.728000),
            new vec3(-0.620000, 0.384923, 11.376000),
            new vec3(-1.344000, 0.384923, 9.352000),
            new vec3(1.116000, 0.384923, 9.000000),
            new vec3(1.008000, 0.384923, 11.728000),
            new vec3(1.008000, 0.384923, 11.376000),
            new vec3(-1.344000, 0.384923, 9.000000),
            new vec3(-0.250000, 10.788000, 0.104000),
            new vec3(-0.250000, 11.728000, -0.628000),
            new vec3(-0.250000, 11.728000, -1.100000),
            new vec3(-0.250000, 10.444000, -0.088000),
            new vec3(-0.250000, 9.000000, -0.088000),
            new vec3(-0.250000, 9.000000, 0.304000),
            new vec3(-0.250000, 10.440000, 0.304000),
            new vec3(-0.250000, 11.728000, 1.316000),
            new vec3(-0.250000, 11.728000, 0.844000),
            new vec3(0.304321, 9.000000, -0.088000),
            new vec3(0.304321, 9.000000, 0.304000),
            new vec3(0.304321, 10.440000, 0.304000),
            new vec3(0.304321, 10.444000, -0.088000),
            new vec3(0.304321, 11.728000, 1.316000),
            new vec3(0.304321, 10.788000, 0.104000),
            new vec3(0.304321, 11.728000, -0.628000),
            new vec3(0.304321, 11.728000, -1.100000),
            new vec3(0.304321, 11.728000, 0.844000),
            new vec3(0.500000, -0.500000, -0.500000),
            new vec3(0.500000, 0.500000, -0.500000),
            new vec3(0.500000, -0.500000, 0.500000),
            new vec3(0.500000, -0.500000, 0.500000),
            new vec3(-0.500000, -0.500000, -0.500000),
            new vec3(-0.500000, 0.500000, -0.500000),
            new vec3(-0.500000, -0.500000, 0.500000),
            new vec3(-0.500000, 0.500000, 0.500000),
            new vec3(-8.500000, 0.500000, 0.500000),
            new vec3(-8.500000, -0.500000, 0.500000),
            new vec3(-8.500000, -0.500000, -0.500000),
            new vec3(-8.500000, 0.500000, -0.500000),
            new vec3(0.500000, 8.500000, -0.500000),
            new vec3(0.500000, 8.500000, 0.500000),
            new vec3(-0.500000, 8.500000, 0.500000),
            new vec3(-0.500000, 8.500000, -0.500000),
            new vec3(0.500000, 0.500000, 8.500000),
            new vec3(0.500000, -0.500000, 8.500000),
            new vec3(-0.500000, -0.500000, 8.500000),
            new vec3(-0.500000, 0.500000, 8.500000)
        ];
        axis.tris = [
            [6, 5, 4],
            [6, 4, 3],
            [3, 2, 1],
            [3, 1, 12],
            [6, 3, 12],
            [7, 6, 12],
            [7, 12, 9],
            [9, 12, 11],
            [7, 9, 8],
            [10, 9, 11],
            [18, 17, 23],
            [18, 21, 17],
            [21, 15, 24],
            [21, 16, 15],
            [18, 16, 21],
            [20, 16, 18],
            [20, 14, 16],
            [14, 19, 16],
            [20, 13, 14],
            [22, 19, 14],
            [6, 23, 5],
            [9, 13, 8],
            [10, 14, 9],
            [7, 18, 6],
            [1, 16, 12],
            [11, 22, 10],
            [2, 15, 1],
            [5, 17, 4],
            [4, 21, 3],
            [3, 24, 2],
            [8, 20, 7],
            [12, 19, 11],
            [32, 31, 30],
            [32, 30, 25],
            [25, 30, 29],
            [26, 25, 29],
            [26, 29, 28],
            [26, 28, 27],
            [39, 34, 38],
            [39, 35, 34],
            [35, 33, 34],
            [37, 33, 35],
            [37, 36, 33],
            [37, 40, 36],
            [28, 40, 27],
            [25, 39, 32],
            [32, 38, 31],
            [26, 35, 25],
            [29, 36, 28],
            [30, 33, 29],
            [27, 37, 26],
            [31, 34, 30],
            [44, 42, 43],
            [44, 41, 42],
            [41, 48, 49],
            [41, 47, 48],
            [44, 47, 41],
            [45, 47, 44],
            [45, 46, 47],
            [53, 57, 56],
            [53, 56, 55],
            [55, 58, 54],
            [55, 54, 52],
            [53, 55, 52],
            [50, 53, 52],
            [50, 52, 51],
            [58, 41, 49],
            [50, 46, 45],
            [55, 42, 41],
            [54, 49, 48],
            [51, 47, 46],
            [52, 48, 47],
            [56, 43, 42],
            [57, 44, 43],
            [53, 45, 44],
            [60, 61, 59],
            [65, 78, 66],
            [66, 68, 65],
            [64, 59, 63],
            [65, 59, 61],
            [60, 72, 62],
            [67, 69, 68],
            [63, 70, 64],
            [65, 69, 63],
            [64, 67, 66],
            [72, 74, 73],
            [64, 71, 60],
            [62, 73, 66],
            [66, 74, 64],
            [75, 77, 76],
            [61, 77, 65],
            [66, 75, 62],
            [62, 76, 61],
            [6, 18, 23],
            [9, 14, 13],
            [10, 22, 14],
            [7, 20, 18],
            [1, 15, 16],
            [11, 19, 22],
            [2, 24, 15],
            [5, 23, 17],
            [4, 17, 21],
            [3, 21, 24],
            [8, 13, 20],
            [12, 16, 19],
            [28, 36, 40],
            [25, 35, 39],
            [32, 39, 38],
            [26, 37, 35],
            [29, 33, 36],
            [30, 34, 33],
            [27, 40, 37],
            [31, 38, 34],
            [58, 55, 41],
            [50, 51, 46],
            [55, 56, 42],
            [54, 58, 49],
            [51, 52, 47],
            [52, 54, 48],
            [56, 57, 43],
            [57, 53, 44],
            [53, 50, 45],
            [60, 62, 61],
            [65, 77, 78],
            [66, 67, 68],
            [64, 60, 59],
            [65, 63, 59],
            [60, 71, 72],
            [67, 70, 69],
            [63, 69, 70],
            [65, 68, 69],
            [64, 70, 67],
            [72, 71, 74],
            [64, 74, 71],
            [62, 72, 73],
            [66, 73, 74],
            [75, 78, 77],
            [61, 76, 77],
            [66, 78, 75],
            [62, 75, 76]
        ];
        this.mesh.push(axis);
        //d8
        //this.meshCube.pts = [new vec3(0, 0, 0), new vec3(1, 0, 0), new vec3(1, 1, 0), new vec3(0, 1, 0), new vec3(0.5, 0.5, 0.75), new vec3(0.5, 0.5, -0.75)];
        //this.meshCube.tris = [[4, 3, 0], [4, 2, 3], [4, 1, 2], [4, 0, 1], [5, 0, 3], [5, 3, 2], [5, 2, 1], [5, 1, 0]];

        let fNear = 0.1;
        let fFar = 1000;
        let fFov = 90;
        let fAspectRatio = this.canvas.height / this.canvas.width;
        this.matProj = Mat4x4.proj(fFov, fAspectRatio, fFar, fNear);
	}
    update(dTime) {
        let forward = this.cameraDir.mul(dTime * 3);
        let right = Mat4x4.rotY(90*Math.PI/180).mulVec3(forward);
        if (keys[" "]) {
            this.camera.y -= dTime * 3;
        }
        if (keys.c) {
            this.camera.y += dTime * 3;
        }
        if (keys.a) {
            this.camera = this.camera.add(right);
        }
        if (keys.d) {
            this.camera = this.camera.sub(right);
        }
        if (keys.w) {
            this.camera = this.camera.add(forward);
        }
        if (keys.s) {
            this.camera = this.camera.sub(forward);
        }
        if (keys.ArrowRight) {
            this.cAngle.y -= dTime * 2;
        }
        if (keys.ArrowLeft) {
            this.cAngle.y += dTime * 2;
        }
        if (keys.ArrowUp) {
            this.cAngle.x += dTime * 2;
        }
        if (keys.ArrowDown) {
            this.cAngle.x -= dTime * 2;
        }
        let matRotY = Mat4x4.rotY(0);

        let matRotZ = Mat4x4.rotZ(Math.PI);

        let matRotX = Mat4x4.rotX(0);

        let matTrans = Mat4x4.translation(new vec3(0, 0, 3));
        let matWorld = Mat4x4.idenity();
        matWorld = matRotX.mulMat(matRotY);
        matWorld = matRotZ.mulMat(matWorld);
        matWorld = matWorld.mulMat(matTrans);

        let up = new vec3(0, 1, 0);
        
        let target = new vec3(0,0,1);

        let matCameraRot = Mat4x4.rotY(this.cAngle.y);
        //target = Mat4x4.rotX(this.cAngle.x).mulVec3(target);
        this.cameraDir = matCameraRot.mulVec3(target);
        target = this.camera.add(this.cameraDir);
        let matCamera = Mat4x4.pointAt(this.camera, target, up);
        matCamera = matCamera.inverse();

        let triToRaster = [];

        for(let meshC = 0; meshC < this.mesh.length; meshC++){
            let mesh = this.mesh[meshC];
            let matMesh = Mat4x4.translation(mesh.pos);
            for (let i = 0; i < mesh.tris.length; i++) {
                let triProjected = new Triangle();

                triProjected.pts[0] = mesh.pts[mesh.tris[i][0]-1];
                triProjected.pts[1] = mesh.pts[mesh.tris[i][1]-1];
                triProjected.pts[2] = mesh.pts[mesh.tris[i][2]-1];

                triProjected = matMesh.mulTri(triProjected);

                triProjected = matWorld.mulTri(triProjected);

                let line1 = triProjected.pts[1].sub(triProjected.pts[0]);

                let line2 = triProjected.pts[2].sub(triProjected.pts[0]);

                let normal = line1.crossProd(line2);

                normal.normalize();

                let cameraRay = triProjected.pts[0].sub(this.camera);

                if (normal.dotProd(cameraRay) < 0 || this.drawHidden) {
                    let lightDir = new vec3(0, 1, -1);
                    lightDir.normalize();

                    var dp = Math.max(normal.dotProd(lightDir), 0.5);

                    triProjected = matCamera.mulTri(triProjected);

                    let clip = this.tClipPlane(new vec3(0,0,1), new vec3(0,0,1), triProjected);

                    for(let n = 0; n < clip.length; n++){

                        triProjected = this.matProj.mulTri(clip[n]);

                        triProjected.pts[0] = triProjected.pts[0].div(triProjected.pts[0].w);
                        triProjected.pts[1] = triProjected.pts[1].div(triProjected.pts[1].w);
                        triProjected.pts[2] = triProjected.pts[2].div(triProjected.pts[2].w);

                        let col = new Color(dp * mesh.col.r, dp * mesh.col.g, dp * mesh.col.b);

                        triProjected = triProjected.addVec(new vec3(1, 1, 1))

                        triProjected = triProjected.mulVec(new vec3(0.5 * this.canvas.width, 0.5 * this.canvas.height, 1));
                        triProjected.col = col;
                        triToRaster.push(triProjected);
                    }
                }
            }
        }
        function compare(a,b){
            let z1 = (a.pts[0].z + a.pts[1].z + a.pts[2].z) / 3;
            let z2 = (b.pts[0].z + b.pts[1].z + b.pts[2].z) / 3;
            return z1 - z2;
        }
        triToRaster.sort(compare);
        for(let a = 0; a < triToRaster.length; a++){
            let tri = triToRaster[a];
            let listTri = [];
            listTri.push(tri);
            let newTris = 1;
            for(let p = 0; p < 4; p++){
                let trisToAdd = 0;
                while(newTris > 0){
                    let test = listTri.shift();
                    newTris--;
                    let tris = [];
                    switch(p){
                        case 0:
                            tris = this.tClipPlane(new vec3(0,0,0), new vec3(0,1,0), test);
                            break;
                        case 1:
                            tris = this.tClipPlane(new vec3(0,this.canvas.height - 1,0), new vec3(0,-1,0), test);
                            break;
                        case 2:
                            tris = this.tClipPlane(new vec3(0,0,0), new vec3(1,0,0), test);
                            break;
                        case 3:
                            tris = this.tClipPlane(new vec3(this.canvas.width - 1,0,0), new vec3(-1,0,0), test);
                            break;
                                        
                    }
                    for(let w = 0; w < tris.length; w++){
                        listTri.push(tris[w]);
                    }
                }
                newTris = listTri.length;
            }
            for(let g = 0; g < listTri.length; g++){
                this.drawTri(
                    listTri[g].pts[0].x,
                    listTri[g].pts[0].y,
                    listTri[g].pts[1].x,
                    listTri[g].pts[1].y,
                    listTri[g].pts[2].x,
                    listTri[g].pts[2].y,
                    this.rgb(listTri[g].col)
                );
            }
        }
    }
    rgb(a) {
        return "rgb(" + (a.r * 255) + "," + (a.g * 255) + "," + (a.b * 255) + ")";
    }
    drawTri(x1, y1, x2, y2, x3, y3, col) {
        this.ctx.strokeStyle = (
            this.drawMode == this.FillMode.wireframe ? "#FFFFFF" : (
                this.drawMode == this.FillMode.shaded ? col : "#000000")
        );
        this.ctx.fillStyle = col;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        if (this.drawMode != this.FillMode.wireframe) {
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.stroke();
        }
    }
    drawLine(x1, y1, x2, y2, cssColor) {
        this.ctx.strokeStyle = cssColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    intersect(pp, pn, lstart, lend){
        pn.normalize();
        var pd = -pn.dotProd(pp);
        var ad = lstart.dotProd(pn);
        var bd = lend.dotProd(pn);
        var t = (-pd - ad) / (bd - ad);
        var lstartToEnd = lend.sub(lstart);
        var lToIntersect = lstartToEnd.mul(t);
        return lstart.add(lToIntersect);
    }
    tClipPlane(pp,pn,tri){
        pn.normalize();

        function dist(n){
            return pn.x * n.x + pn.y * n.y + pn.z * n.z - pn.dotProd(pp);
        }
        let insidePts = [];
        let outsidePts = [];
        
        let d0 = dist(tri.pts[0]);
        let d1 = dist(tri.pts[1]);
        let d2 = dist(tri.pts[2]);

        if(d0 >= 0){
            insidePts.push(tri.pts[0]);
        }
        else{
            outsidePts.push(tri.pts[0]);
        }
        if(d1 >= 0){
            insidePts.push(tri.pts[1]);
        }
        else{
            outsidePts.push(tri.pts[1]);
        }
        if(d2 >= 0){
            insidePts.push(tri.pts[2]);
        }
        else{
            outsidePts.push(tri.pts[2]);
        }
        if(insidePts.length == 0){
            return [];
        }
        if(insidePts.length == 3){
            return [tri];
        }
        if(insidePts.length == 1 && outsidePts.length == 2){
            let otri = new Triangle();
            otri.col = tri.col;
            otri.pts[0] = insidePts[0];
            otri.pts[1] = this.intersect(pp,pn,insidePts[0],outsidePts[0]);
            otri.pts[2] = this.intersect(pp,pn,insidePts[0],outsidePts[1]);
            return [otri];
        }
        if(insidePts.length == 2 && outsidePts.length == 1){
            let otri = new Triangle();
            otri.col = tri.col;
            otri.pts[0] = insidePts[0];
            otri.pts[1] = insidePts[1];
            otri.pts[2] = this.intersect(pp,pn,insidePts[0],outsidePts[0]);

            let otri2 = new Triangle();
            otri2.col = tri.col;
            otri2.pts[0] = insidePts[1];
            otri2.pts[1] = otri.pts[2];
            otri2.pts[2] = this.intersect(pp,pn,insidePts[1],outsidePts[0]);
            return [otri, otri2];
        }
    }
}
function main() {
    
    let e = new Engine();
    e.ctx.fillStyle = "#000000";
alert("f");
    e.ctx.fillRect(0, 0, e.canvas.width, e.canvas.height);
    e.update(0.3);
    window.setInterval(function () {
        if (keys.x || true) {
            e.ctx.fillStyle = "#000000";
            e.ctx.fillRect(0, 0, e.canvas.width, e.canvas.height);
            e.update(0.03);
        }
    }, 30);
}
window.addEventListener("keydown", function (event) {
    keys[event.key] = true;
});
window.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});
main();