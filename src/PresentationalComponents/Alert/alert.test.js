import Alert from './alert';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

describe('Alert', () => {
    test('should render correctly', () => {
        const successAlert = mount(<Alert type="success">Some text</Alert>)
        const dangerAlert = mount(<Alert type="danger">Some text</Alert>)
        const warningAlert = mount(<Alert type="warning">Some text</Alert>)
        const infoAlert = mount(<Alert type="info">Some text</Alert>)
        expect(toJson(successAlert)).toMatchSnapshot();
        expect(toJson(dangerAlert)).toMatchSnapshot();
        expect(toJson(warningAlert)).toMatchSnapshot();
        expect(toJson(infoAlert)).toMatchSnapshot();
    });
});
