import path from "path";

import dirTree from "directory-tree";
import fs from "fs";

function toSidebarOption(tree = []) {
    if (!Array.isArray(tree)) return [];

    return tree.map((v) => {
        if(!v.path.startsWith("docs/.vitepress")) {
            if (v.children !== undefined) {
                return {
                    text: v.name,
                    collapsible: true,
                    collapsed: true,
                    items: toSidebarOption(v.children),
                };
            } else {
                return {
                    // text: v.name.replace(".md", ""),
                    text: getMarkdownTitle(v.path),
                    link: v.path.split("docs")[1].replace(".md", ""),
                };
            }
        }
    });
}

function getMarkdownTitle(filePath: string): string {

    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/title:\s*(.*)/);
    return match ? match[1] : path.basename(filePath, ".md");
}

export function autoGetSidebarOptionBySrcDir(srcPath: string, title: string) {
    const srcDir = dirTree(srcPath, {
        extensions: /\.md$/,
        normalizePath: true,
    });
    return [
        {
            text: title === undefined ?  srcDir.name : title ,
            collapsible: true,
            collapsed: true,
            items: toSidebarOption(srcDir.children),
        },
    ];

}