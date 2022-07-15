import {
  VSM_FILTER_WORDS,
  WordVector
} from "../../../models/vsm";
import { textToVSM } from "../text-to-vector-state-model";
import {
  cosineSim,
  vsmCosineSim
} from "../cosine-similarity";
import { toVector } from "../to-vector";
import { TFIDF    } from "../tf-idf";

// Test Suites
describe('Text to VSM', () => {

  it('blank phrase produces empty result', () => {
    const result: Record<string, number> = textToVSM('', ',');

    expect(toVector(result).length).toBe(0);
  });

  it('invalid delim produces empty result', () => {
    const result: Record<string, number> = textToVSM('blah', '');

    expect(toVector(result).length).toBe(0);
  });

  it('undefined phrase produces empty result', () => {
    const tmp: any = undefined;
    const result: Record<string, number> = textToVSM(tmp, '');

    expect(toVector(result).length).toBe(0);
  });

  it('singleton filter word produces empty result', () => {
    const result: Record<string, number> = textToVSM('for', ',');

    expect(toVector(result).length).toBe(0);
  });

  it('singleton filter word produces empty result (w/lowercase)', () => {
    const result: Record<string, number> = textToVSM('FOR', ',');

    expect(toVector(result).length).toBe(0);
  });

  it('blank string with blank delim produces empty result', () => {
    const result: Record<string, number> = textToVSM('  ', ' ');

    expect(toVector(result).length).toBe(0);
  });

  it('single keyword with blank delim produces singleton result', () => {
    const result: Record<string, number> = textToVSM('blah', ' ');

    const vec: Array<WordVector> = toVector(result);
    expect(vec.length).toBe(1);

    const word: WordVector = vec[0];
    expect(word.word).toBe('blah');
    expect(word.value).toBe(1);
  });

  it('commas and periods ignored', () => {
    const result: Record<string, number> = textToVSM('blah, blah', ' ');

    const vec: Array<WordVector> = toVector(result);
    expect(vec.length).toBe(1);

    const word: WordVector = vec[0];
    expect(word.word).toBe('blah');
    expect(word.value).toBe(2);
  });

  it('VSM properly accumulates with multiple phrases', () => {
    const result: Record<string, number> = textToVSM('blah', ' ');

    let vec: Array<WordVector> = toVector(result);
    expect(vec.length).toBe(1);

    const word: WordVector = vec[0];
    expect(word.word).toBe('blah');
    expect(word.value).toBe(1);

    const nextResult: Record<string, number> = textToVSM('ugly', ' ', VSM_FILTER_WORDS, true, result);
    vec = toVector(nextResult);
    expect(vec.length).toBe(2);
  });

  it('Two-phrase test, blank delim', () => {
    const result: Record<string, number> = textToVSM('The sky is blue', ' ');

    let vec: Array<WordVector> = toVector(result);
    expect(vec.length).toBe(2);

    let word: WordVector = vec[0];
    expect(word.word).toBe('sky');
    expect(word.value).toBe(1);

    word = vec[1];
    expect(word.word).toBe('blue');
    expect(word.value).toBe(1);

    const nextResult: Record<string, number> = textToVSM('The sun is bright', ' ', VSM_FILTER_WORDS, true, result);
    vec = toVector(nextResult);
    expect(vec.length).toBe(4);

    word = vec[2];
    expect(word.word).toBe('sun');
    expect(word.value).toBe(1);

    word = vec[3];
    expect(word.word).toBe('bright');
    expect(word.value).toBe(1);
  });

});

describe('Basic cosine similarity', () => {

  it('two empty vectors produce a zero result', () => {
    const result: number = cosineSim([], []);

    expect(result).toBe(0);
  });


  it('two singleton vectors produces correct result #1', () => {
    const result: number = cosineSim([0], [0]);

    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #2', () => {
    const result: number = cosineSim([1], [0]);

    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #3', () => {
    const result: number = cosineSim([0], [1]);

    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #4', () => {
    const result: number = cosineSim([1], [1]);

    expect(result).toBe(1);
  });

  it('two-element parallel vectors produces correct result', () => {
    let result: number = cosineSim([1, 0], [2, 0]);

    expect(Math.abs(result-1) < 0.000001).toBe(true);

    result = cosineSim([-1, 0], [2, 0]);

    expect(Math.abs(result+1) < 0.000001).toBe(true);
  });

  it('general test produces correct result', () => {
    const result: number = cosineSim([3,8,7,5,2,9], [10,8,6,6,4,5]);

    expect(Math.abs(result-0.8639) < 0.001).toBe(true);
  });
});

describe('VSM cosine similarity', () => {

  it('two empty collections produce a zero result', () => {
    const result: number = vsmCosineSim({}, {});

    expect(result).toBe(0);
  });


  it('two singleton VSMs produces correct result #1', () => {
    const result: number = vsmCosineSim({a: 0}, {a: 0});

    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #2', () => {
    let result: number = vsmCosineSim( {a: 1}, {a: 0} );

    expect(result).toBe(0);

    result = vsmCosineSim( {a: 1, b: 0}, {a: 0, c: -1} );
    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #3', () => {
    const result: number = vsmCosineSim( {b: 0}, {b: 1} );

    expect(result).toBe(0);
  });

  it('two singleton vectors produces correct result #4', () => {
    const result: number = vsmCosineSim( {prop: 1}, {prop: 1} );

    expect(result).toBe(1);
  });

  it('two-element parallel vectors produces correct result', () => {
    let result: number = vsmCosineSim( {a: 1, b: 0}, {a: 2, b: 0} );

    expect(Math.abs(result-1) < 0.000001).toBe(true);

    result = vsmCosineSim( {a: -1, b: 0}, {a: 2, b: 0} );

    expect(Math.abs(result+1) < 0.000001).toBe(true);
  });

  it('general test produces correct result', () => {
    const result: number = vsmCosineSim({a: 3, b: 8, c: 7, d: 5, e: 2, f: 9}, {a: 10, b: 8, c: 6, d: 6, e: 4, f: 5, g: -1});

    expect(Math.abs(result-0.8639) < 0.001).toBe(true);
  });
});

describe('TF/IDF', () => {

  const tf: TFIDF    = new TFIDF();
  const train: TFIDF = new TFIDF();
  const test: TFIDF  = new TFIDF();

  it('size of empty document collection is zero', () => {
    expect(tf.size).toBe(0);
  });

  it('collection accepts new VSM (also test clear)', () => {
    tf.clear();

    tf.addRow(textToVSM('this is a test', ' '));
    expect(tf.size).toBe(1);

    tf.clear();
    expect(tf.size).toBe(0);
  });

  it('basic vocabulary test', () => {
    train.clear();

    train.addRow(textToVSM('The sky is blue', ' '));
    train.addRow(textToVSM('The sun is bright', ' '));

    // MUST compute frequency first for vocab to be valid
    const result: Array<string> = train.vocabulary;
    expect(result.length).toBe(4);

    expect(result[0]).toBe('sky');
    expect(result[1]).toBe('blue');
    expect(result[2]).toBe('sun');
    expect(result[3]).toBe('bright');
  });

  it('basic freq. count test', () => {
    train.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    expect(train.size).toBe(2);

    train.computeFreq();

    let freq: number = train.getTF('blah');
    expect(freq).toBe(0);

    freq = train.getTF('is');
    expect(freq).toBe(0);

    freq = train.getTF('sky');
    expect(freq).toBe(1);

    freq = train.getTF('blue');
    expect(freq).toBe(1);

    freq = train.getTF('sun');
    expect(freq).toBe(1);

    freq = train.getTF('bright');
    expect(freq).toBe(1);
  });

  it('mult. freq. count test w/clear', () => {
    train.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    train.addRow( textToVSM('The plane is in the sky', ' ') );
    train.addRow( textToVSM('The bright object is blue', ' ') );
    expect(train.size).toBe(4);

    train.computeFreq();

    let freq: number = train.getTF('sky');
    expect(freq).toBe(2);

    freq = train.getTF('blue');
    expect(freq).toBe(2);

    freq = train.getTF('sun');
    expect(freq).toBe(1);

    freq = train.getTF('bright');
    expect(freq).toBe(2);

    freq = train.getTF('plane');
    expect(freq).toBe(1);

    freq = train.getTF('object');
    expect(freq).toBe(1);
  });

  it('ext. vocabulary frequency test', () => {
    train.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    expect(train.size).toBe(2);

    const vocab: Array<string> = train.vocabulary;

    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    test.computeVocabFreq(vocab);

    expect( test.getVF(0, 'sky') ).toBe(1);
    expect( test.getVF(0, 'sun') ).toBe(1);
    expect( test.getVF(0, 'bright') ).toBe(1);
    expect( test.getVF(0, 'blue') ).toBe(0);

    expect( test.getVF(1, 'sky') ).toBe(0);
    expect( test.getVF(1, 'sun') ).toBe(2);
    expect( test.getVF(1, 'bright') ).toBe(1);
    expect( test.getVF(1, 'blue') ).toBe(0);
  });

  it('IDF test', () => {
    train.clear();
    test.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    expect(train.size).toBe(2);

    const vocab: Array<string> = train.vocabulary;

    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    train.computeIDF(test);

    let idf: number = train.getIDF('sky');
    expect(idf).toBe(0);

    idf = train.getIDF('sun');
    expect(Math.abs(idf + 0.405465) < 0.001).toBe(true);

    idf = train.getIDF('bright');
    expect(Math.abs(idf + 0.405465) < 0.001).toBe(true);

    idf = train.getIDF('blue');
    expect(Math.abs(idf - 0.69314718) < 0.001).toBe(true);
  });

  it('TF/IDF test #1', () => {
    train.clear();
    test.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    expect(train.size).toBe(2);

    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    train.tfIDF(test);

    let tfidf: Record<string, number> = train.getTFIDF(0) as Record<string, number>;

    let value: number = tfidf['sun'];
    expect( Math.abs(value+0.70710678) < 0.0001).toBe(true);

    value = tfidf['bright'];
    expect( Math.abs(value+0.70710678) < 0.0001).toBe(true);

    tfidf = train.getTFIDF(1) as Record<string, number>;
    value = tfidf['sun'];
    expect( Math.abs(value+0.89442719) < 0.0001).toBe(true);

    value = tfidf['bright'];
    expect( Math.abs(value+0.447213595) < 0.0001).toBe(true);
  });

  it('TF/IDF test #2', () => {
    train.clear();
    test.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );
    expect(train.size).toBe(2);

    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    train.tfIDF(test);

    let tfidf: Record<string, number> = train.getTFIDF(0) as Record<string, number>;

    let value: number = tfidf['sun'];
    expect( Math.abs(value+0.70710678) < 0.0001).toBe(true);

    value = tfidf['bright'];
    expect( Math.abs(value+0.70710678) < 0.0001).toBe(true);

    tfidf = train.getTFIDF(1) as Record<string, number>;
    value = tfidf['sun'];
    expect( Math.abs(value+0.89442719) < 0.0001).toBe(true);

    value = tfidf['bright'];
    expect( Math.abs(value+0.447213595) < 0.0001).toBe(true);
  });

  it('Similarity test #1', () => {
    train.clear();
    test.clear();

    test.addRow( textToVSM('The sky is blue', ' ') );
    test.addRow( textToVSM('The sun is bright', ' ') );
    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    // test for greatest similarity in first row, against second set of data
    let index: number = test.similarity(0, TFIDF.GREATEST, 2);
    expect(index).toBe(2);

    // test for greatest similarity in second row, against second set of data
    index = test.similarity(1, TFIDF.GREATEST, 2);
    expect(index).toBe(3);
  });

  it('Similarity-to test #1', () => {
    train.clear();
    test.clear();

    train.addRow( textToVSM('The sky is blue', ' ') );
    train.addRow( textToVSM('The sun is bright', ' ') );

    test.addRow( textToVSM('The sun in the sky is bright.', ' ') );
    test.addRow( textToVSM('We can see the shining sun, the bright sun.', ' ') );

    // test for greatest similarity of a phrase in the test set against the vocabulary described in the training set
    // it's actually very close to a tie for this example
    let index: number = train.similarityTo(test, TFIDF.GREATEST);
    expect(index).toBe(0);

    index = train.similarityTo(test, TFIDF.LEAST);
    expect(index).toBe(1);
  });
});
