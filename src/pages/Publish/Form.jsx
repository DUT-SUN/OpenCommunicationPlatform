import {
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message,
    Modal,
    Divider,
} from 'antd'
import { Flex } from 'antd';
import { useParams } from 'react-router-dom';
import { Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './index.scss'
import ReactQuill from 'react-quill'
import MarkDownDoc from './MarkDownDoc'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
import PublishStore from '@/store/Publish.Store'
import { getToken } from '@/utils/token'
import { Spin, Empty } from 'antd'
const { Option } = Select;

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
const PublishForm = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [TagLength, setTagLength] = useState(0)
    const [selectedValue, setSelectedValue] = useState([]);
    const handleChange = value => {
        // console.log(value);
        if (selectedTags.includes(value)) {
            message.warning("标签不要重复添加喔");
            return
        }
        if (value === 'custom') {
            setIsModalVisible(true);
            setSelectedValue([]);
        } else {
            setSelectedTags([...selectedTags, value]);
            setSelectedValue([]);
        }
        setTagLength(TagLength + 1)
    };
    const { channelStore } = useStore()
    // 存放上传图片的列表
    const [fileList, setFileList] = useState([])
    // 这个函数的执行分阶段 是从updating到done的过程
    // 这个过程只要上传图片内容发生变化就会不断执行直到全部上传完毕
    // 使用useRef声明一个暂存仓库
    const cacheImgList = useRef([])
    const onUploadChange = ({ fileList }) => {
        // console.log(fileList);
        // 同时把图片列表存入仓库一份
        // 这里关键位置:需要做数据格式化
        const formatList = fileList.map(file => {
            // console.log(file)
            // 上传完毕 做数据处理
            if (file.response) {
                return {
                    url: file.response.data.url
                }
            }
            // 否则在上传中时，不做处理
            return file
        })
        setFileList(formatList)
        cacheImgList.current = formatList
    }
    // 切换图片
    const [imgCount, setImageCount] = useState(1)
    const radioChange = (e) => {
        // 这里要使用e.target.value做判断
        const rawValue = e.target.value
        setImageCount(rawValue)
        // 无图模式
        if (cacheImgList.current.length === 0) {
            return false
        }
        // 单图模式
        if (rawValue === 1) {
            const img = cacheImgList.current[0]
            setFileList([img])
            // 多图模式
        } else if (rawValue === 3) {
            setFileList(cacheImgList.current)
        }
    }
    useEffect(() => {
        channelStore.loadChannelList()
    }, [])
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 提交表单
    const navigate = useNavigate()
    const onFinish = async (values) => {
        const { title, description } = values
        if (id) {
            await PublishStore.updateArticle(id, title, PublishStore.content, description, selectedTags, fileList.map(item => item.url))
        } else {
            const res = await PublishStore.addArticle(title, PublishStore.content, description, selectedTags, fileList.map(item => item.url))
            id = res.data
            await sleep(1000); //删除缓存不会那么快
        }
        // // 跳转列表 提示用户
        message.success(`${id ? '更新成功' : '发布成功'}`)
        navigate(`/list/detail?id=${id}`)
    }
    // 编辑功能
    // 文案适配  路由参数id 判断条件
    // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
    const [form] = Form.useForm()
    let { id } = useParams();
    const [loading, setLoading] = useState(true)
    //如果是编辑文章那么我就去获取数据set
    const { ArticleStore } = useStore()
    useEffect(() => {
        const loadDetail = async () => {
            const res = await ArticleStore.getArticle(id);
            setLoading(false);
            if (form) { // 检查form实例是否存在
                form.setFieldsValue({ title: `${res.title}` });
                form.setFieldsValue({ description: `${res.description}` });
                setSelectedTags([...selectedTags, ...(res.type ? res.type.split(',') : [])]);
                const avatarArray = res.avatar.split(',');
                // console.log(avatarArray)
                const formatList = avatarArray.map((url, index) => {
                    if (url) {
                        return {
                            id: index.toString(), // 每个文件需要一个唯一的id
                            url: url, // 文件的URL
                        };
                    }
                    return null; // 如果url为空，返回null
                }).filter(item => item); // 过滤掉null值
                setFileList(formatList)
                // console.log(formatList.length);
                let typeValue;
                if (formatList.length === 0) {
                    typeValue = 0;
                } else if (formatList.length === 1) {
                    typeValue = 1;
                } else {
                    typeValue = 3;
                }
                setImageCount(formatList.length)
                form.setFieldsValue({ type: typeValue });
            }
            // console.log(res.avatar);
        }
        if (id) {
            loadDetail();
        }
    }, [id, form])
    const handleClose = removedTag => {
        const newTags = selectedTags.filter(tag => tag !== removedTag);
        setSelectedTags(newTags);
    };

    useEffect(() => {
        setTagLength(selectedTags.length);
        // console.log(selectedTags);

    }, [selectedTags]);

    const handleOk = () => {
        setSelectedTags([...selectedTags, customTag]);
        setCustomTag('');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setCustomTag('');
        setIsModalVisible(false);
    };

    const handleInputChange = e => {
        setCustomTag(e.target.value);
    };

    return (
        <> <Modal title="添加自定义标签" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input placeholder="请输入自定义标签" value={customTag} onChange={handleInputChange} />
        </Modal>

            <Modal title={null} footer={null}
                open={PublishStore.visible}
                onOk={PublishStore.handleOk}
                onCancel={PublishStore.handleCancel}>
                <Form
                    style={{ padding: '20px' }}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1, content: '' }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="description"
                        rules={[{ required: false, message: '请输入文章描述' }]}
                    >
                        <Input placeholder="请输入文章描述" style={{ width: 400 }} />
                    </Form.Item>
                    {TagLength > 0 &&
                        <Form.Item className='right'>
                            <Divider orientation="left"></Divider>
                            <Flex gap="4px 0" wrap="wrap" >
                                {selectedTags.map((tag, index) => (
                                    <Tag color={colors[index % colors.length]} key={tag} closable
                                        onClose={() => handleClose(tag)}>
                                        {tag}
                                    </Tag>
                                ))}
                            </Flex>
                            <Divider orientation="left"></Divider>
                        </Form.Item>}
                    <Form.Item
                        label="标签"
                        name="channel_id"
                        rules={[{ required: false, message: '请选择文章标签' }]}
                    >
                        <Select placeholder="请选择文章标签" style={{ width: 400 }} value={selectedValue} onChange={handleChange}>
                            <Option value="custom" onClick={() => handleChange('custom')}>添加自定义标签</Option>
                            {channelStore.channelList.map(item => (
                                <Option key={item.id} value={item.name} onClick={() => handleChange(item.name)}>{item.name}</Option>
                            ))}
                        </Select>

                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type" >
                            <Radio.Group onChange={radioChange}>
                                <Radio value={0}>无图</Radio>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>

                            </Radio.Group>
                        </Form.Item>
                        {imgCount > 0 && (
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList
                                action="http://localhost:8080/art/upload"
                                fileList={fileList}
                                onChange={onUploadChange}
                                multiple={imgCount > 1}
                                maxCount={imgCount}
                                headers={{
                                    'Authorization': getToken(), // 你的token
                                }}
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>
                        )}
                    </Form.Item>
                    {/* 这里的富文本组件 已经被Form.Item控制 */}
                    {/* 它的输入内容 会在onFinished回调中收集起来 */}
                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {id ? '更新' : '发布'}文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default observer(PublishForm) 