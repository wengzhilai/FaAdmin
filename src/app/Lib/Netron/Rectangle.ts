import { NetronPoint } from "./Point";

    export class NetronRectangle
    {
        public x: number;
        public y: number;
        public width: number;
        public height: number;

        constructor(x, y, width, height)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public contains(point: NetronPoint)
        {
            return ((point.x >= this.x) && (point.x <= (this.x + this.width)) && (point.y >= this.y) && (point.y <= (this.y + this.height)));
        }

        public inflate(dx: number, dy: number)
        {
            this.x -= dx;
            this.y -= dy;
            this.width += dx + dx + 1;
            this.height += dy + dy + 1;
        }

        public union(rectangle: NetronRectangle)
        {
            var x1 = (this.x < rectangle.x) ? this.x : rectangle.x;
            var y1 = (this.y < rectangle.y) ? this.y : rectangle.y;
            var x2 = ((this.x + this.width) < (rectangle.x + rectangle.width)) ? (rectangle.x + rectangle.width) : (this.x + this.width);
            var y2 = ((this.y + this.height) < (rectangle.y + rectangle.height)) ? (rectangle.y + rectangle.height) : (this.y + this.height);
            return new NetronRectangle(x1, y1, x2 - x1, y2 - y1);
        }

        public get topLeft(): NetronPoint
        {
            return new NetronPoint(this.x, this.y);
        }

        public clone(): NetronRectangle
        {
            return new NetronRectangle(this.x, this.y, this.width, this.height);
        }
    }
