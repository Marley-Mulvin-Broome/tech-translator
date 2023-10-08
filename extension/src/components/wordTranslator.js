import { injectHtml } from "../logic/htmlInjector";

const WordTranslator = async (props) => {
    const self = {};

    const init = async () => {
        await injectHtml("wordTranslator.html", document.body);
    }

    await init();

    return {

    };
}

export default WordTranslator;