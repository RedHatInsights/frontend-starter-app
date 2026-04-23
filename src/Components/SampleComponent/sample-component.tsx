import './sample-component.scss';
import type { FC, PropsWithChildren } from 'react';

const SampleComponent: FC<PropsWithChildren> = (props) => {
  return <span className="sample-component"> {props.children} </span>;
};

export default SampleComponent;
