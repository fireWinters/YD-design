/// <reference types="react" />
export interface PreviewUrl {
    url: string;
    preview: boolean;
}
export declare type PreviewUrlMap = Map<number, PreviewUrl>;
export declare type UnRegisterPreviewUrl = (id: number) => void;
export declare type RegisterPreviewUrl = (id: number, url: string, preview: boolean) => UnRegisterPreviewUrl;
export interface PreviewGroupContextProps {
    previewGroup: boolean;
    previewUrlMap: Map<number, string>;
    infinite?: boolean;
    currentIndex: number;
    setCurrentIndex: (current: number) => void;
    setPreviewUrlMap: (map: PreviewUrlMap) => void;
    registerPreviewUrl: RegisterPreviewUrl;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}
export declare const PreviewGroupContext: import("react").Context<PreviewGroupContextProps>;
