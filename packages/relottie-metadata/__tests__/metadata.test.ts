/**
 * Copyright 2024 Design Barn Inc.
 */

import relottieParse from '@lottiefiles/relottie-parse';
import { unified } from 'unified';
import { VFile } from 'vfile';

import type { Metadata, MetadataFileData } from '../src/metadata.js';
import metadata from '../src/metadata.js';

// momoa preserves syntactically-duplicate JSON members as separate AST nodes,
// so two "fr" attributes are visited in document order — letting us prove the
// second (falsy) value actually overwrites the first, rather than relying on
// Metadata's own zero/empty-string defaults to mask a regression.
const run = (doc: string): Metadata => {
  const processor = unified()
    .use(relottieParse, { position: false })
    .use(metadata, { fileSize: { enable: false, options: {} } });
  const tree = processor.parse(doc);
  const file = new VFile(doc);

  processor.runSync(tree, file);

  return (file.data as MetadataFileData).metadata;
};

describe('metadata() — nullish-only falsy guard', () => {
  test('an explicit 0 overwrites a previously-set framerate instead of being skipped as falsy', () => {
    const doc = '{"v":"5.5.2","fr":24,"fr":0,"ip":0,"op":10,"w":1,"h":1,"ddd":0,"layers":[]}';

    expect(run(doc).framerate).toBe(0);
  });

  test('an explicit empty string overwrites a previously-set version instead of being skipped as falsy', () => {
    const doc = '{"v":"5.5.2","v":"","fr":24,"ip":0,"op":10,"w":1,"h":1,"ddd":0,"layers":[]}';

    expect(run(doc).version).toBe('');
  });

  test('a null value is still skipped, leaving the prior value untouched', () => {
    const doc = '{"v":"5.5.2","fr":24,"fr":null,"ip":0,"op":10,"w":1,"h":1,"ddd":0,"layers":[]}';

    expect(run(doc).framerate).toBe(24);
  });
});
