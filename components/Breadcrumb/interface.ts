import { CSSProperties, ReactNode } from 'react';
import { DropdownProps } from '../Dropdown';

export interface RouteProps {
  path: string;
  breadcrumbName: string;
  children?: Array<{ path: string; breadcrumbName: string }>;
}

/**
 * @title Breadcrumb
 */
export interface BreadcrumbProps {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string | string[];
  /**
   * @zh 指定分割符
   * @en Custom separator
   * @defaultValue <IconObliqueLine />
   */
  separator?: string | ReactNode;
  /**
   * @zh 直接设置下拉菜单
   * @en Set drop-down menu
   */
  routes?: RouteProps[];
  /**
   * @zh 最多渲染的面包屑数量
   * @en Max count of `Breadcrumb.Item` to show.
   */
  maxCount?: number;
  /**
   * @zh routes 时生效，自定义渲染面包屑
   * @en Custom render function for `Breadcrumb.Item`
   */
  itemRender?: (route: RouteProps, routes: RouteProps[], paths: string[]) => ReactNode;
}

type CustomHTMLElement = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

/**
 * @title Breadcrumb.Item
 */
export interface BreadCrumbItemProps extends CustomHTMLElement {
  style?: CSSProperties;
  className?: string | string[];
  prefixCls?: string;
  /**
   * @zh 下拉菜单的内容，等同于下拉菜单组件的 droplist 属性
   * @en The dropdown menu
   */
  droplist?: DropdownProps['droplist'];
  /**
   * @zh 下拉菜单的属性 [DropdownProps](/react/components/dropdown)
   * @en The dropdown props [DropdownProps](/react/components/dropdown)
   */
  dropdownProps?: DropdownProps;
}
