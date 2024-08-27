import { useDispatch } from 'react-redux';
import { AppDispatch } from "@renderer/redux/store";
import MarkdownPreview from '@uiw/react-markdown-preview';
import help_de from './help/help_de.md';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { setOpenHelpDialog } from '@renderer/redux/appSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  //bgcolor: 'red',
  borderRadius: '24px',
};

export const HelpMain = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Paper sx={style} elevation={3}>
      <Stack sx={{ height: '100%' }}>
        {/* <img src={icon} alt="icon" style={{ width: '24px', height: '24px' }} /> */}
        <IconButton
          sx={{position: 'absolute', right: '8px', top: '4px'}}
          onClick={() => dispatch(setOpenHelpDialog(false))}
        >
          <CloseIcon />
        </IconButton>
        <MarkdownPreview
          style={{ padding: 16, borderRadius: '24px' }}
          source={help_de}
          rehypeRewrite={(node, _index, parent) => {
            // @ts-ignore
            if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
              parent.children = parent.children.slice(1)
            }
          }}
          //urlTransform={uri => uri.startsWith("http") ? uri : `${window.envVar.ELECTRON_RENDERER_URL}${uri}`}
        />
      </Stack>
    </Paper>
  )
}

export default HelpMain
