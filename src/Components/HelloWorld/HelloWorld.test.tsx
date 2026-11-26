import { render, screen } from '@testing-library/react';
import HelloWorld, { getContract } from './HelloWorld';

test('renders the default greeting', () => {
  render(
    <HelloWorld input={{ runId: 'run-123' }} meta={{ source: 'debug' }} />,
  );
  expect(screen.getByText('Hello World run-123')).toBeInTheDocument();
});

test('renders the supplied text', () => {
  render(
    <HelloWorld
      input={{ text: 'Hello from the starter app', runId: 'run-456' }}
    />,
  );
  expect(
    screen.getByText('Hello from the starter app run-456'),
  ).toBeInTheDocument();
});

test('exposes a JSON-serializable widget contract', () => {
  expect(JSON.parse(JSON.stringify(getContract()))).toEqual({
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
  });
});
