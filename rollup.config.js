import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import builtins from 'rollup-plugin-node-builtins';

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
			sourcemap: false
		},
		plugins: [
			builtins(),
			typescript(),
			resolve(), // tells Rollup how to find date-fns in node_modules
			commonjs(), // converts date-fns to ES modules
			production && terser(), // minify, but only in production
		]
	},
];
