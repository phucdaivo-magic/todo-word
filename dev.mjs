import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'fs';
import { generateCSSForFile } from './src/libs/scan.js';

// auto load file form src/js and src/scss
const jsFiles = fs.readdirSync('src/js').map((file) => `src/js/${file}`);
const scssFiles = fs.readdirSync('src/scss').filter(file => file.endsWith('.scss')).filter((file) => !file.startsWith('_')).map((file) => `src/scss/${file}`);
const htmlFiles = fs.readdirSync('src/html').filter(file => file.endsWith('.html')).map((file) => `src/html/${file}`);
const cssFiles = fs.readdirSync('src/css').filter(file => file.endsWith('.css')).map((file) => `src/css/${file}`);
const entryPoints = [...scssFiles, ...jsFiles, ...htmlFiles, ...cssFiles];

const timer = {
    start: new Date(),
    end: null,
    duration: null,
}

const customPlugin = {
    name: 'custom-plugin',
    setup(build) {
        build.onStart(() => {
            timer.start = new Date()
            console.log('build started at', new Date())
            generateCSSForFile({ srcDir: 'src', outDir: 'src/css' });
        })
        build.onEnd(() => {
            timer.end = new Date()
            timer.duration = timer.end - timer.start
            console.log('build ended at', new Date())
            console.log('build duration', timer.duration + 'ms')
        })
        build.onDispose(() => {
            console.log('This plugin is no longer used')
        })

        const options = build.initialOptions
        options.define = options.define || {}
        options.define['process.env.NODE_ENV'] =
            options.minify ? '"production"' : '"development"'
    },
}

let ctx = await esbuild.context({
    entryPoints,
    absPaths: ['log', 'metafile'],
    bundle: true,
    outdir: 'www',
    plugins: [sassPlugin(), customPlugin],
    assetNames: 'assets/[name]',
    sourcemap: true,
    minify: true,
    loader: { '.png': 'file', '.css': 'empty', '.woff': 'file', '.jpg': 'file', '.html': 'file' },
    // hide warnings
    logLevel: 'silent',
})

await ctx.watch()

// Start server on port 3000 with live reload
let { host, port } = await ctx.serve({
    servedir: 'www',
    port: 3000,
});
console.log(`Server running at http://localhost:${port}`)
console.log('Live reload enabled - browser will refresh on file changes')