import { Box } from '@chakra-ui/react';
import EditorJS from '@editorjs/editorjs';
import { useEffect } from 'react';

const EditorJSComponent = () => {
  const editor = new EditorJS();

  // useEffect(() => {
  //   const Editorjs = require('@editorjs/editorjs');
  //   new Editorjs('editorjs');
  //   console.log('yo');
  // }, []);

  return <Box id='editorjs' />;
};
export default EditorJSComponent;
