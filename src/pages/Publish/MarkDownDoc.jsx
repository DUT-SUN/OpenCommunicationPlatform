import React, { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { config } from 'md-editor-rt';
import { keymap } from '@codemirror/view';
import axios from 'axios'
import PublishStore from '@/store/Publish.Store'
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '@/store/index'
import { Spin, Empty  } from 'antd'
import './index.scss'
config({
    // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
    codeMirrorExtensions(theme, extensions, mdEditorCommands) {
        const newExtensions = [...extensions];
        // 1. Remove the default shortcut key extension first
        newExtensions.shift();

        // 2. Reference the source code for shortcut key configuration
        // Find the location of the configuration item for CtrlB in mdEditorCommands
        const CtrlB = mdEditorCommands[0];

        // 3. Document for configuring shortcut keys of codemirror
        // https://codemirror.net/docs/ref/#commands
        const CtrlM = {
            // We need the run method in CtrlB here
            ...CtrlB,
            key: 'Ctrl-m',
            mac: 'Cmd-m'
        };

        // 4. Add the modified shortcut key to the array
        const newMdEditorCommands = [
            CtrlM,
            ...mdEditorCommands.filter((i) => i.key !== 'Ctrl-b')
        ];

        newExtensions.push(keymap.of(newMdEditorCommands));

        return newExtensions;
    }
});

//上传图片接口还没有做
const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
        files.map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', file);

                axios
                    .post('/api/img/upload', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((res) => rev(res))
                    .catch((error) => rej(error));
            });
        })
    );

    callback(res.map((item) => item.data.url));
};


const MarkDownDoc = observer(() => {
    const { ArticleStore } = useStore()
    const { id } = useParams();
    
    const [loading, setLoading] = useState(true)
    //如果是编辑文章那么我就去获取数据set
    useEffect(() => {
        const getText = async (id) => {
            if (id) {
                const res = await ArticleStore.getArticle(id)
                // console.log(res.content)
                PublishStore.setContent(res.content)
            }else{
                PublishStore.setContent("")
            }
            setLoading(false)

        }
        getText(id)
    }, [id])
    // console.log(id,11)
    const [theme] = useState('github');
    return loading ?  <Empty style={{height: '506px'}}/>: <MdEditor className="md" modelValue={PublishStore.content} onChange={PublishStore.setContent} onUploadImg={onUploadImg} theme={theme} />;
});

export default MarkDownDoc;