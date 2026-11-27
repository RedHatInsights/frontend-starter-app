import React from 'react';

interface HelloWorldInput {
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
    widget: 'frontendStarterApp.HelloWorld',
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

export default function HelloWorld({
  input: { text = 'Hello World', runId },
}: {
  input: HelloWorldInput;
  meta?: unknown;
}): JSX.Element {
  return (
    <>
      {text} {runId}
    </>
  );
}
