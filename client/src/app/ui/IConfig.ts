export interface IGuiItem {
    key: string;
    value?: any;
    min?: number;
    max?: number;
    steps?: number;
    keycode?: string;
    default?: any;
    fn: (value: any) => void;
}

export interface IConfig {
    title: string;
    open: boolean;
    subitemsValues: IGuiItem[];
    subitemsButtons: IGuiItem[];
}
