import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';

interface WordListProps {
  words: string[];
  onEditWord: (index: number, editedWord: string) => void;
  onDeleteWord: (index: number) => void; // 削除機能用のコールバック
}

const WordList: React.FC<WordListProps> = ({ words, onEditWord, onDeleteWord }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedWord, setEditedWord] = useState('');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEditClick = (index: number, word: string) => {
    setSelectedWordIndex(index);
    setEditedWord(word);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedWordIndex(null);
    setEditedWord('');
  };

  const handleSaveEdit = () => {
    if (selectedWordIndex !== null) {
      onEditWord(selectedWordIndex, editedWord);
    }
    handleEditDialogClose();
  };

  const handleDeleteClick = (index: number) => {
    setSelectedWordIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedWordIndex(null);
  };

  const handleConfirmDelete = () => {
    if (selectedWordIndex !== null) {
      onDeleteWord(selectedWordIndex);
    }
    handleDeleteDialogClose();
  };

  return (
    <div>
      <List>
        {words.map((word, index) => (
          <ListItem key={index}>
            <ListItemText primary={word} />
            <Button onClick={() => handleEditClick(index, word)}>編集</Button>
            <Button onClick={() => handleDeleteClick(index)}>削除</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>英単語を編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="編集後の英単語"
            fullWidth
            value={editedWord}
            onChange={(e) => setEditedWord(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>キャンセル</Button>
          <Button onClick={handleSaveEdit}>保存</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>英単語を削除</DialogTitle>
        <DialogContent>
          <p>本当に削除しますか？</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>キャンセル</Button>
          <Button onClick={handleConfirmDelete}>削除</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordList;
