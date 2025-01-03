import 'zx/globals'
import 'fs/promises';

const mallocTypes = [
  'emmalloc',
  'dlmalloc',
  'mimalloc',
];

const sanitizerTypes = [
  'null',
  'undefined',
  'address',
];

const dataSizes = [
  '1',
  '2',
  '5',
  '10',
];

const emsdkVersions = [
  '3.1.74',
  '3.1.59',
];

const uid = (await $`id -u`).stdout.trimEnd();
const gid = (await $`id -g`).stdout.trimEnd();
const pwd = (await $`pwd`).stdout.trimEnd();

function construct_args(emsdkVersion, useUnorder, dataSize, mallocType, sanitizerType) {
  const args = [
    'run',
    '--rm',
    `--user=${uid}:${gid}`,
    '-t',
    '-v', `${pwd}:/src`,
    '--workdir', '/src',
    `emscripten/emsdk:${emsdkVersion}`,
    'em++',
    '-sINITIAL_MEMORY=200mb'
  ];

  if (!useUnorder) { // little bit confused, but I have run this code. the variable name should be changed into useOrder
    args.push('-DUSE_UNORDER')
  }
  args.push(`-DDATA_${dataSize}`);
  args.push(`-sMALLOC=${mallocType}`);
  if (sanitizerType !== 'null') {
    args.push(`-fsanitize=${sanitizerType}`);
  }
  args.push('-o');
  args.push(`out-${Array.from(arguments).join('-')}.js`);
  args.push('main.cc');

  return args;
}

for (const emsdkVersion of emsdkVersions) {
  for (const useUnorder of [true, false]) {
    for (const dataSize of dataSizes) {
      for (const mallocType of mallocTypes) {
        for (const sanitizerType of sanitizerTypes) {
          const args = construct_args(emsdkVersion, useUnorder, dataSize, mallocType, sanitizerType);
          const fname = args[args.length - 2];
          console.log(fname);
          const resultFile = `result-${fname}.txt`;
          const existance = await fs.exists(resultFile);
          if (existance) {
            continue;
          }

          await $`docker ${args}`;
  
          await $`node ${fname} > ${resultFile} 2>&1`.nothrow();
          // throw new Error("Run completed");
        }
      }
    }
  }
}
