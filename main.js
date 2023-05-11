class vec3{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class triangle{
    constructor(){
        this.pts = [];
    }
}

class mesh{
    constructor(){
        this.tris = [];
        this.pts = [];
    }
}

class mat4x4{
    constructor(){
        this.m = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }
}

class Engine{
    constructor(){
        this.meshCube = null;
        this.matProj = null;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContest("2d");
        this.canvas.width = 640;
        this.canvas.height = 480;
    }
    onUserCreate(){
        this.meshCube.tris = [
            [new vec3(0,0,0),  new vec3(0,1,0),  new vec3(1,1,0)],
            [new vec3(0,0,0),  new vec3(1,1,0),  new vec3(1,0,0)],
            [new vec3(1,0,0),  new vec3(1,1,0),  new vec3(1,1,1)],
            [new vec3(1,0,0),  new vec3(1,1,1),  new vec3(1,0,1)],
            [new vec3(1,0,1),  new vec3(1,1,1),  new vec3(0,1,1)],
            [new vec3(1,0,1),  new vec3(0,1,1),  new vec3(0,0,1)],
            [new vec3(0,0,1),  new vec3(0,1,1),  new vec3(0,1,0)],
            [new vec3(0,0,1),  new vec3(0,1,0),  new vec3(0,0,0)],
            [new vec3(0,1,0),  new vec3(0,1,1),  new vec3(1,1,1)],
            [new vec3(0,1,0),  new vec3(1,1,1),  new vec3(1,1,0)],
            [new vec3(1,0,1),  new vec3(0,0,1),  new vec3(0,0,0)],
            [new vec3(1,0,1),  new vec3(0,0,0),  new vec3(1,0,0)]
        ];
        let fNear = 0.1;
        let fFar = 1000;
        let fFov = 90; 
        let fAspectRatio = this.canvas.height/this.canvas.width;
        let fFovRad = 1 / Math.tan(Ffov * 0.5 / 180 * Math.PI);
        this.matProj = new mat4x4();
        this.matProj.m[0][0] = fAspectRatio * fFovRad;
        this.matProj.m[1][1] = fFovRad;
        this.matProj.m[2][2] = fFar / (fFar - fNear);
        this.matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
        this.matProj.m[2][3] = 1.0;
        this.matProj.m[3][3] = 0;
        return true;
    }
    onUserUpdate(dTime){
        for(let i = 0; i < this.meshCube.tris.length; i++){
            let tri = this.meshCube.tri[i];
            let triProjected = new Triangle();
            triProjected.pts[0] = this.multiplyMatrix(tri.pts[0], this.matProj);
            triProjected.pts[1] = this.multiplyMatrix(tri.pts[1], this.matProj);
            triProjected.pts[2] = this.multiplyMatrix(tri.pts[2], this.matProj);
            this.drawTri(
                triProjected.p[0].x,
                triProjected.p[0].y,
                triProjected.p[1].x,
                triProjected.p[1].x,
                triProjected.p[2].x,
                triProjected.p[2].x,
                "#808080"
            );
        }

        return true;
    }
    multiplyMatrix(i, m){
        let o = new vec3();
        o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
        o.x = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
        o.x = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
        let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];

        if(w != 0){
            o.x /= w;
            o.y /= w;
            o.z /= w;
        }
        return o;
    }
    drawTri(x1,y1,x2,y2,x3,y3,col){
        this.drawLine(x1,y1,x2,y2, col);
        this.drawLine(x2,y2,x3,y3, col);
        this.drawLine(x3,y3,x1,y1, col);
    }
    drawLine(x1, y1, x2, y2, cssColor) {
        this.ctx.strokeStyle = cssColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}

function main(){
    let e = new Engine();
    e.onUserCreate();
}