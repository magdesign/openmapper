import {IDimension} from "./DimensionTransformer";

export class Mapper {

    public static uv(size: number): IDimension[] {
        return this.map(
            size,
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 1, y: 1, z: 0},
        );
    }


      /**
     * get back IDimension object with startpoint. is used for initialation of video quad
     * @param size of vertice
     * @param length of vertice
     * @param startPoint where the vertice apears
     */
    public static verticesWithStartPoint(size: number, length: number, startPoint: IDimension): IDimension[] {
        return this.map(
            size,
            {x: startPoint.x, y: startPoint.y, z: startPoint.z},
            {x: startPoint.x, y: startPoint.y + length, z: startPoint.z},
            {x: (startPoint.x + length), y: startPoint.y, z: startPoint.z},
            {x: (startPoint.x + length), y: startPoint.y + length, z: startPoint.z},
        );
    }

    /**
     * get back IDimension object with startpoint. is used for initialation of video quad
     * @param size of vertice
     * @param length of vertice
     * @param startPoint where the vertice apears
     */
    public static verticesWithHeightAndWidth(size: number, heigth: number, width: number, startPoint: IDimension): IDimension[] {
        return this.map(
            size,
            {x: startPoint.x, y: startPoint.y, z: startPoint.z},
            {x: startPoint.x, y: startPoint.y + heigth, z: startPoint.z},
            {x: (startPoint.x + width), y: startPoint.y, z: startPoint.z},
            {x: (startPoint.x + width), y: startPoint.y + heigth, z: startPoint.z},
        );
    }



    public static vertices(size: number, length: number): IDimension[] {
        return this.map(
            size,
            {x: 0, y: 0, z: 0},
            {x: 0, y: length, z: 0},
            {x: length, y: 0, z: 0},
            {x: length, y: length, z: 0},
        );
    }

    public static addVector(point: IDimension, vector: IDimension): IDimension {
        return {
            x: point.x + vector.x,
            y: point.y + vector.y,
            z: point.z + vector.z,
        };
    }

    /**
     * maps wireframe in given positions
     * @param size amount of points in vertices object (resolution of wireframe)
     * @param bottomLeft point
     * @param topLeft point
     * @param bottomRight point
     * @param topRight point
     */
    public static map(size: number, bottomLeft: IDimension, topLeft: IDimension, bottomRight: IDimension, topRight: IDimension): IDimension[] {
        const leftX = this.getDeltaSide(size, bottomLeft.x, topLeft.x);
        const rightX = this.getDeltaSide(size, bottomRight.x, topRight.x);

        const bottomY = this.getDeltaSide(size, topLeft.y, topRight.y);
        const topY = this.getDeltaSide(size, bottomLeft.y, bottomRight.y);

        let resultX = [];
        let resultY = [];


        for (let i = 0; i < size; i++) {
            resultX.push(this.getDeltaSide(size, leftX[i], rightX[i]));
            resultY.push(this.getDeltaSide(size, topY[i], bottomY[i]));
        }

        resultY = resultY.reduce((a, b) => a.concat(b));
        resultX = this.parse(size, resultX);


        const result: IDimension[] = [];
        for (let i = 0; i < resultX.length; i++) {
            result.push({
                x: resultX[i],
                y: resultY[i],
                z: bottomLeft.z,
            });
        }
        return result;
    }

    private static getDeltaSide(size: number, start: number, end: number): number[] {
        const result: number[] = [];
        const part: number = end - start;

        for (let i = 0; i < size; i++) {
            result.push(part * i / (size - 1) + start);
        }

        return result;
    }

    private static parse(size: number, parsed: number[][]) {
        const result = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                result.push(parsed[j][i]);
            }
        }
        return result;
    }
}
