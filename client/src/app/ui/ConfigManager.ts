import { IConfig, IGuiItem } from "./IConfig";


export class ConfigManager {


    public static updateDropDown(gui, folder: string, property: string, value: any[]): void {
        gui.__folders[folder].__controllers
            .filter((controll) => controll.property === property)
            .map((controll) => {

                // dat gui doesnt provide an option for updating dropdown values
                // therefore it must be overwritten with plain html
                const html = value
                    .map((val: string): string => `<option>${val}</option>`)
                    .reduce((a: string, b: string): string => a + b)

                controll.domElement.children[0].innerHTML = html;
                return controll;
            });
    }

    public static createGuiElements(gui, config): void {

        const controllerValue = ConfigManager.generateValueController(config);
        const controllerButton = ConfigManager.generateButtonController(config);

        config.map((value: IConfig) => {
            const subfolder = gui.addFolder(value.title);

            if (value.open) {
                subfolder.open();
            }
        
            value.subitemsValues.map((subitem: IGuiItem) => {
                switch (typeof controllerValue[subitem.key]) {
                    case "object":
                        subfolder.add(controllerValue, subitem.key, subitem.value).onChange(subitem.fn);
                        break;
                    default:
                        subfolder.add(controllerValue, subitem.key).onChange(subitem.fn);
                        break;
                }
            });
        
            value.subitemsButtons.map((subitem: IGuiItem) => {
                subfolder.add(controllerButton, subitem.key);
            });
        });
    }

    private static generateValueController(config: IConfig[]): any {
        return ConfigManager.generateConfig(config,
            (val) => val.subitemsValues,
            (val) => {
                const obj = {};
                obj[val.key] = val.value;
                return obj;
            });
    }

    private static generateButtonController(config: IConfig[]): any {
        return ConfigManager.generateConfig(config,
            (val) => val.subitemsButtons,
            (val) => {
                const obj = {};
                obj[val.key] = val.fn;
                return obj;
            });
    }

    private static generateConfig(config: IConfig[], fnSubitem: (conf: IConfig) => any, fnValue: (val: any) => any) {
        return config
            .map(fnSubitem)
            .reduce((a, b) => a.concat(b))
            .map(fnValue)
            .reduce((a, b) => {
                return {...a, ...b};
            });
    }
}
