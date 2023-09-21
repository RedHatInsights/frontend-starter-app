import './sample-component.scss';
import React from 'react';

const SampleComponent = (props: { children?: any }) => {
  return <span className="sample-component"> {props.children} </span>;
};

SampleComponent.displayName = 'SampleComponent';

export default SampleComponent;
