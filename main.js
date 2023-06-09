alert("e");
try {
    class vec3 {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    class Triangle {
        constructor() {
            this.pts = [];
        }
    }

    class Mesh {
        constructor() {
            this.tris = [];
            this.pts = [];
        }
    }

    class Mat4x4 {
        constructor() {
            this.m = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        }
    }

    class Engine {
        constructor() {
            try {
                this.meshCube = new Mesh();
                this.matProj = new Mat4x4();
                this.canvas = document.getElementById("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.canvas.width = 640;
                this.canvas.height = 480;
                this.fTheta = 0
            } catch (e) { alert(e) }
        }
        onUserCreate() {
            this.meshCube.tris = [
                [new vec3(0, 0, 0), new vec3(0, 1, 0), new vec3(1, 1, 0)],
                [new vec3(0, 0, 0), new vec3(1, 1, 0), new vec3(1, 0, 0)],
                [new vec3(1, 0, 0), new vec3(1, 1, 0), new vec3(1, 1, 1)],
                [new vec3(1, 0, 0), new vec3(1, 1, 1), new vec3(1, 0, 1)],
                [new vec3(1, 0, 1), new vec3(1, 1, 1), new vec3(0, 1, 1)],
                [new vec3(1, 0, 1), new vec3(0, 1, 1), new vec3(0, 0, 1)],
                [new vec3(0, 0, 1), new vec3(0, 1, 1), new vec3(0, 1, 0)],
                [new vec3(0, 0, 1), new vec3(0, 1, 0), new vec3(0, 0, 0)],
                [new vec3(0, 1, 0), new vec3(0, 1, 1), new vec3(1, 1, 1)],
                [new vec3(0, 1, 0), new vec3(1, 1, 1), new vec3(1, 1, 0)],
                [new vec3(1, 0, 1), new vec3(0, 0, 1), new vec3(0, 0, 0)],
                [new vec3(1, 0, 1), new vec3(0, 0, 0), new vec3(1, 0, 0)]
            ];
            let fNear = 0.1;
            let fFar = 1000;
            let fFov = 90;
            let fAspectRatio = this.canvas.height / this.canvas.width;
            let fFovRad = 1 / Math.tan(fFov * 0.5 / 180 * Math.PI);
            this.matProj.m[0][0] = fAspectRatio * fFovRad;
            this.matProj.m[1][1] = fFovRad;
            this.matProj.m[2][2] = fFar / (fFar - fNear);
            this.matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
            this.matProj.m[2][3] = 1.0;
            this.matProj.m[3][3] = 0;
            return true;
        }

        onUserUpdate(dTime) {
            try {
                let matRotZ = new Mat4x4();
                let matRotX = new Mat4x4();

                this.fTheta += dTime;
                console.log(this.fTheta);

                matRotZ.m[0][0] =  Math.cos(this.fTheta);
                matRotZ.m[0][1] =  Math.sin(this.fTheta);
                matRotZ.m[1][0] = -Math.sin(this.fTheta);
                matRotZ.m[1][1] =  Math.cos(this.fTheta);
                matRotZ.m[2][2] = 1;
                matRotZ.m[3][3] = 1;

                matRotX.m[0][0] = 1;
                matRotX.m[1][1] = Math.cos(this.fTheta * 0.5);
                matRotX.m[1][2] = Math.sin(this.fTheta * 0.5);
                matRotX.m[2][1] = -Math.sin(this.fTheta * 0.5);
                matRotX.m[2][2] = Math.cos(this.fTheta * 0.5);
                matRotX.m[3][3] = 1;

                for (let i = 0; i < this.meshCube.tris.length; i++) {
                    let tri = this.meshCube.tris[i];
                    let triProjected = new Triangle();

                    triProjected.pts[0] = this.multiplyMatrix(tri[0], matRotX);
                    triProjected.pts[1] = this.multiplyMatrix(tri[1], matRotX);
                    triProjected.pts[2] = this.multiplyMatrix(tri[2], matRotX);

                    triProjected.pts[0] = this.multiplyMatrix(triProjected.pts[0], matRotZ);
                    triProjected.pts[1] = this.multiplyMatrix(triProjected.pts[1], matRotZ);
                    triProjected.pts[2] = this.multiplyMatrix(triProjected.pts[2], matRotZ);

                    triProjected.pts[0].z = triProjected.pts[0].z + 3;
                    triProjected.pts[1].z = triProjected.pts[1].z + 3;
                    triProjected.pts[2].z = triProjected.pts[2].z + 3;

                    triProjected.pts[0] = this.multiplyMatrix(triProjected.pts[0], this.matProj);
                    triProjected.pts[1] = this.multiplyMatrix(triProjected.pts[1], this.matProj);
                    triProjected.pts[2] = this.multiplyMatrix(triProjected.pts[2], this.matProj);

                    triProjected.pts[0].x += 1;
                    triProjected.pts[0].y += 1;
                    triProjected.pts[1].x += 1;
                    triProjected.pts[1].y += 1;
                    triProjected.pts[2].x += 1;
                    triProjected.pts[2].y += 1;

                    triProjected.pts[0].x *= 0.5 * this.canvas.width;
                    triProjected.pts[0].y *= 0.5 * this.canvas.height;
                    triProjected.pts[1].x *= 0.5 * this.canvas.width;
                    triProjected.pts[1].y *= 0.5 * this.canvas.height;
                    triProjected.pts[2].x *= 0.5 * this.canvas.width;
                    triProjected.pts[2].y *= 0.5 * this.canvas.height;
                    this.drawTri(
                        triProjected.pts[0].x,
                        triProjected.pts[0].y,
                        triProjected.pts[1].x,
                        triProjected.pts[1].y,
                        triProjected.pts[2].x,
                        triProjected.pts[2].y,
                        "#808080"
                    );
                }
            } catch (e) { alert(e) }
            return true;
        }
        multiplyMatrix(i, m) {
            let o = new vec3();
            o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
            o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
            o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
            let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];

            if (w != 0) {
                o.x /= w;
                o.y /= w;
                o.z /= w;
            }
            return o;
        }
        drawTri(x1, y1, x2, y2, x3, y3, col) {
            this.drawLine(x1, y1, x2, y2, col);
            this.drawLine(x2, y2, x3, y3, col);
            this.drawLine(x3, y3, x1, y1, col);
        }
        drawLine(x1, y1, x2, y2, cssColor) {
            this.ctx.strokeStyle = cssColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
    function main() {
        alert("f");
        let e = new Engine();
        e.onUserCreate();
        window.setInterval(function () {
            e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
            e.onUserUpdate(0.03);
        }, 30);
    }
} catch (e) { alert(e) }
main();
