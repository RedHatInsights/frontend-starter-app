import React from 'react';

interface HelloWorldProps {
  runId: string;
  text?: string;
}

interface HelloWorldContract {
  widget: string;
  schemaVersion: string;
  inputSchema: {
    type: 'object';
    properties: {
      runId: { type: 'string'; minLength: number };
      text: { type: 'string'; minLength: number };
    };
    required: string[];
    additionalProperties: false;
  };
  outputSchema: null;
}

export function getContract(): HelloWorldContract {
  return {
    widget: 'starter.hello-world',
    schemaVersion: '1.0',
    inputSchema: {
      type: 'object',
      properties: {
        runId: { type: 'string', minLength: 1 },
        text: { type: 'string', minLength: 1 },
      },
      required: ['runId'],
      additionalProperties: false,
    },
    outputSchema: null,
  };
}

const HelloWorld = ({
  text = 'Hello World',
  runId,
}: HelloWorldProps): JSX.Element => (
  <>
    {text} {runId}
  </>
);

export default HelloWorld;
