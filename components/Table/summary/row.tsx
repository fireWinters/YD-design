import React, { useContext, ReactNode, ReactElement, HTMLAttributes } from 'react';
import { SummaryContext } from './context';
import cs from '../../_util/classNames';
import { Omit } from '../../_util/type';

interface SummaryRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  children?: ReactNode;
}

function Row(props: SummaryRowProps) {
  const { columns, stickyOffsets, stickyClassNames, prefixCls } = useContext(SummaryContext);

  const { children, ...rest } = props;

  const colSpans = React.Children.map(
    children,
    (child) => (child as ReactElement).props.colSpan || 1
  );

  const element = React.Children.map(children, (child, index) => {
    const childElement = child as ReactElement;
    const isSummaryCell = childElement?.props?.$$ArcoTableSummaryCell;

    const childStyle = childElement?.props?.style;
    const childClassName = childElement?.props?.className;

    const prevAllColSpan = colSpans.slice(0, index).reduce((p, n) => p + n, 0);

    const stickyIndex = prevAllColSpan;

    const stickyStyle =
      columns[stickyIndex].fixed === 'left'
        ? { left: stickyOffsets[stickyIndex] }
        : columns[stickyIndex].fixed === 'right'
        ? { right: stickyOffsets[stickyIndex] }
        : {};

    const stickyClassName =
      columns[stickyIndex].fixed === 'left' || columns[stickyIndex].fixed === 'right'
        ? stickyClassNames[stickyIndex]
        : '';

    return isSummaryCell
      ? React.cloneElement(childElement, {
          ...childElement.props,
          className: cs(`${prefixCls}-td`, stickyClassName, childClassName),
          style: { ...childStyle, ...stickyStyle },
        })
      : child;
  });
  return <tr {...rest}>{element}</tr>;
}

export default Row;
