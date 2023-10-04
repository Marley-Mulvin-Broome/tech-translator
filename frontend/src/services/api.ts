// これはダミーデータです。実際の API レスポンスを模倣しています。
const dummyData = [
    { id: 1, word: 'apple' },
    { id: 2, word: 'banana' },
    { id: 3, word: 'cherry' },
  ];
  
  // ダミーデータをエクスポートします。
  export const getWords = () => {
    return dummyData;
  };
  
  export const addWord = (newWord: string) => {
    // ダミーデータに新しい単語を追加します。
    const newId = dummyData.length + 1;
    const newItem = { id: newId, word: newWord };
    dummyData.push(newItem);
  };
  
  export const editWord = (id: number, editedWord: string) => {
    // ダミーデータ内の単語を編集します。
    const index = dummyData.findIndex(item => item.id === id);
    if (index !== -1) {
      dummyData[index].word = editedWord;
    }
  };
  
  export const deleteWord = (id: number) => {
    // ダミーデータから単語を削除します。
    const index = dummyData.findIndex(item => item.id === id);
    if (index !== -1) {
      dummyData.splice(index, 1);
    }
  };
  