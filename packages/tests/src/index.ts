import renderFile from './tpl.ejs'
import X from './index.module.scss'

import "./index.scss"

import("./pages/home").then((home) => {
    document.getElementById("root").innerHTML = renderFile({
        name: home.default(),
        list: [1, 2, 3],
        X,
        now: new Date()
    })
})

console.error("renderFile", renderFile);
console.error(import.meta.BUILD_TIME);

