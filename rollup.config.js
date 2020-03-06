import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import builtins from 'rollup-plugin-node-builtins';
import replace from '@rollup/plugin-replace';

import { version } from './package.json';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/odo.ts',
		output: {
			globals: 'ODO',
			name: 'ODO',
			file: 'build/odo.js',
			format: 'umd',
			sourcemap: false,
		},
		plugins: [
			replace({ '__version__': version }),
			builtins(),
			typescript({
				tsconfig: "tsconfig.json",
        tsconfigOverride: {
					exclude: ['test/*.spec.ts'],
				},
			}),
			resolve(), // tells Rollup how to find date-fns in node_modules
			commonjs(), // converts date-fns to ES modules
			production && terser(), // minify, but only in production
		]
	},
];
