import React from 'react';

interface HelloWorldProps {
  text?: string;
}

const HelloWorld = ({ text = 'Hello World' }: HelloWorldProps): JSX.Element => (
  <>{text}</>
);

export default HelloWorld;
