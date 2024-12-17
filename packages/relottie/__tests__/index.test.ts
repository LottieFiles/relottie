/**
 * Copyright 2023 Design Barn Inc.
 */

import { relottie } from '../src/index.js';

describe('relottie', () => {
  test('should parse and stringify a file', async () => {
    const file = await relottie().process('{ "v": "6.0.0" }');

    expect(file.toString()).toEqual('{"v":"6.0.0"}');
  });

  test('should accept parse options', async () => {
    const options = {
      parse: {
        position: false,
        valueType: false,
      },
    };

    const tree = relottie().data('settings', options).parse('{ "v": "6.0.0" }');

    expect(JSON.stringify(tree)).toEqual(
      '{"type":"Root","title":"animation","hasExpressions":false,"children":[{"type":"Attribute","key":"v","title":"version","children":[{"type":"String","value":"6.0.0"}]}]}',
    );
  });
});
