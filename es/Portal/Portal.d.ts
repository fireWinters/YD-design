import { Component } from 'react';
export interface PortalProps {
    /** Portal 挂载的容器 */
    getContainer?: () => Element;
    childrenComponent?: Element;
}
declare class Portal extends Component<PortalProps> {
    container: Element | null | void;
    timer: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    createContainer(): void;
    render(): import("react").ReactPortal;
}
export default Portal;
