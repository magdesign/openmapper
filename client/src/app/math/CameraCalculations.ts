import { Camera } from "three";

export class CameraCalculations {

    public static visibleHeightAtZDepth( depth: number, camera ): number {
        // compensate for cameras not positioned at z=0
        const cameraOffset = camera.position.z;
        if ( depth < cameraOffset ) depth -= cameraOffset;
        else depth += cameraOffset;
      
        // vertical fov in radians
        const vFOV = camera.fov * Math.PI / 180;
      
        // Math.abs to ensure the result is always positive
        return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
    }
      
    public static visibleWidthAtZDepth(depth: number, camera ): number {
        const height = this.visibleHeightAtZDepth( depth, camera );
        return height * camera.aspect;
    }
}
