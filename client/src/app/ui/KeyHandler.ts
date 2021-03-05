import { IConfig, IGuiItem } from "./IConfig";


export class KeyHandler {

    public static createShortCuts(gui, config) {

        const keyItems: IGuiItem[] = KeyHandler.getKeyCodes(config);

        document.addEventListener("keydown", (event) => {
            keyItems
                .filter((keyItem: IGuiItem) => keyItem.keycode === event.code)
                .map((keyItem: IGuiItem) => {

                    keyItem.value = !keyItem.value;

                    config.forEach((conf: IConfig) => {
                        gui.__folders[conf.title].__controllers
                            .filter((ctrl: any) => ctrl.property === keyItem.key)
                            .map((ctrl: any) => ctrl.setValue(keyItem.value));
                    });
                    
                    keyItem.fn(keyItem.value);
                    return keyItem;
                });
        });
    }

    private static getKeyCodes(conf: IConfig[]): IGuiItem[] {
        return conf
            .map((subconf: IConfig): IGuiItem[] => {
                const values = subconf.subitemsValues.filter((guiItem: IGuiItem): boolean => "keycode" in guiItem);
                const buttons = subconf.subitemsButtons.filter((guiItem: IGuiItem): boolean => "keycode" in guiItem);

                return values.concat(buttons);

            })
            .reduce((a, b) => a.concat(b));
    }
}
