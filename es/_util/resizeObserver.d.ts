import React from 'react';
export interface ResizeProps {
    onResize?: (entry: ResizeObserverEntry[]) => void;
}
declare class ResizeObserverComponent extends React.Component<ResizeProps> {
    resizeObserver: any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount: () => void;
    createResizeObserver: () => void;
    destroyResizeObserver: () => void;
    render(): React.ReactNode;
}
export default ResizeObserverComponent;
