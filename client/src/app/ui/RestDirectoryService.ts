

export class RestDirectoryService {


    public static getMediaDirectoryFiles(fn: (vid: any) => void) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    fn(JSON.parse(this.responseText));
                } else {
                    fn(["no video"]);
                }
            }
        };
        const result = request.open("GET", "http://localhost:3000/rest/videos", true);
        request.send(null);
    }
}
