export default {
    './DumbComponents/HelloWorld/hello-world.js': () => import(/* webpackChunkName: "HelloWorld", webpackMode: "lazy" */ './DumbComponents/HelloWorld/hello-world.js')
}