import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'fs';

// auto load file form src/js and src/scss
const jsFiles = fs.readdirSync('src/js').map((file) => `src/js/${file}`);
const scssFiles = fs.readdirSync('src/scss').filter(file => file.endsWith('.scss')).filter((file) => !file.startsWith('_')).map((file) => `src/scss/${file}`);
const entryPoints = [...jsFiles, ...scssFiles];

const customPlugin = {
    name: 'custom-plugin',
    setup(build) {
        build.onStart(() => {
            console.log('build started at', new Date())
            console.log('build started', build.initialOptions.entryPoints)
        })
        build.onEnd(() => {
            console.log('build ended at', new Date())
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
    loader: { '.png': 'file', '.css': 'empty', '.woff': 'file', '.jpg': 'file' },
})

await ctx.watch()

// Start server on port 3000 with live reload
let { host, port } = await ctx.serve({
    servedir: 'www',
    port: 3000,
});
console.log(`Server running at http://localhost:${port}`)
console.log('Live reload enabled - browser will refresh on file changes')