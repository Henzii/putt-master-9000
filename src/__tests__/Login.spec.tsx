import React from 'react';
import renderer from 'react-test-renderer';

import Login from '../components/Login';

describe('Testi', () => {
    it('Loginilla on lapsia...', () => {
        const login: any = renderer.create(<Login login={() => null}/>).toJSON();
        expect(login?.children?.length).toBeGreaterThan(0);
    })
})