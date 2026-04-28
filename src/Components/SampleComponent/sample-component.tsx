import './sample-component.scss';
import type { PropsWithChildren } from 'react';

const SampleComponent = (props: PropsWithChildren) => {
  return <span className="sample-component"> {props.children} </span>;
};

export default SampleComponent;
