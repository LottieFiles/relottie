/**
 * Copyright 2024 Design Barn Inc.
 */

import { isHexValid } from '../src';

// Import the function to be tested
describe('isValidHexColor', () => {
  test('valid hex color: short form RGB', () => {
    expect(isHexValid('#F0C')).toBe(true);
  });

  test('valid hex color: short form RGBA', () => {
    expect(isHexValid('#80FF')).toBe(true);
  });

  test('valid hex color: long form RRGGBB', () => {
    expect(isHexValid('#1A2B3C')).toBe(true);
  });

  test('valid hex color: long form RRGGBBAA', () => {
    expect(isHexValid('#AABBCCDD')).toBe(true);
  });

  test('valid hex color: short form RGB with uppercase letters', () => {
    expect(isHexValid('#ABC')).toBe(true);
  });

  test('valid hex color: short form RGBA with uppercase letters', () => {
    expect(isHexValid('#CDEF')).toBe(true);
  });

  test('valid hex color: long form RRGGBB with uppercase letters', () => {
    expect(isHexValid('#FFAABB')).toBe(true);
  });

  test('valid hex color: long form RRGGBBAA with uppercase letters', () => {
    expect(isHexValid('#112233AA')).toBe(true);
  });

  test('invalid hex color: short form RGB with invalid characters', () => {
    expect(isHexValid('#XZY')).toBe(false);
  });

  test('invalid hex color: short form RGBA with invalid characters', () => {
    expect(isHexValid('#HELLO')).toBe(false);
  });

  test('invalid hex color: long form RRGGBB with invalid characters', () => {
    expect(isHexValid('#12GH34')).toBe(false);
  });

  test('invalid hex color: long form RRGGBBAA with invalid characters', () => {
    expect(isHexValid('#FF00ZZZZ')).toBe(false);
  });

  test('invalid hex color: short form RGB with missing digits', () => {
    expect(isHexValid('#F')).toBe(false);
  });

  test('invalid hex color: short form RGBA with missing digits', () => {
    expect(isHexValid('#12')).toBe(false);
  });
});
