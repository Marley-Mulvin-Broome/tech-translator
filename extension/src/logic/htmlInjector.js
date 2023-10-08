/**
 * HTMLを読み込んで指定した要素に挿入する
 * @param {string} htmlPath 
 * @param {HTMLElement} target 
 */
export const injectHtml = async (htmlPath, target) => {
    const response = await fetch(
        chrome.runtime.getURL(htmlPath)
    )

    if (!response.ok) {
        throw new Error(`Cannot find ${htmlPath}`)
    }

    const html = await response.text()

    target.insertAdjacentHTML('afterbegin', html)
}