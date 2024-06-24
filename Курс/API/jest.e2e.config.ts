import { Config } from '@jest/types';

const Config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: '.e2e.spec.ts$',
};

export default Config;
