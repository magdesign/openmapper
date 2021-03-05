export class LocalStorage {

    public static save(value: any) {
        localStorage.setItem("mapper", JSON.stringify(value));
    }

    public static load(): any {
        const json = localStorage.getItem("mapper");

        return JSON.parse(json);
    }
}
