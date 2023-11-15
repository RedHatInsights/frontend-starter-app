import './sample-component.scss';
import React from 'react';

const SampleComponent: React.FC<React.PropsWithChildren> = (props) => {
  return <span className="sample-component"> {props.children} </span>;
};

export default SampleComponent;
