//modal表单
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Upload, message, Row, Col } from "antd";
import 'antd/es/modal/style';//改变上面那个包model样式
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import LoginIcon from '@/assets/登录.png'
import Captcha from './Captcha.jsx'
import BackgroundVideo from './BackgroundVideo';
import flagStore from '@/store/FlagStore';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
//props接受destory


function LoginRegister() {

  //这个是将注册表单的数据成功之后填到login表单的
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  //判断图片大小和格式

  const beforeUpload = (file) => {
    const isJpgPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgPng) {
      message.error("YOU can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB");
    }
    return isJpgPng;
  };
  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  // 为Form建立引用
  const Regform = React.createRef();
  const LoginForm = React.createRef();
  // 在state内存储modal的visible值
  // 点击submit，form校验成功后获取到form表单的值
  const { loginStore } = useStore();
  const navigate = useNavigate();
  //注册访问的函数
  const onFinish = (values) => {
    Regform.current.validateFields().then(async (value) => {
      const { username, password } = value;

      await loginStore.getReg({ username, password });
      // 存储用户名和密码
      setRegUsername(username);
      setRegPassword(password);
    });
    // 提示用户
    // message.success("注册成功");
    // 跳转首页
    setRegisterVisible(false);
    // navigate("/", { replace: true });
  };
  useEffect(() => {
    setCountdown(60)
  }, [flagStore.flag])
  useEffect(() => {
    //因为首次渲染为空会报错，得加条件判断
    if (LoginForm.current) {
      LoginForm.current.setFieldsValue({
        username: regUsername,
        password: regPassword,
      });
    }
  }, [regUsername, regPassword]);


  //登录访问的函数
  const onLoginFinish = (values) => {
    LoginForm.current.validateFields().then(async (value) => {
      const { username, password, captcha } = value;
      await loginStore.getToken({ username, password, captcha });
    });
    setVisible(false);
  }



  const [registerVisible, setRegisterVisible] = useState(false);

  const handleRegister = () => {
    setRegisterVisible(true);
  };

  const handleRegisterOk = (e) => {
    console.log(e);
    setRegisterVisible(false);
  };
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


  const handleRegisterCancel = (e) => {
    console.log(e);
    setRegisterVisible(false);
  };

  const handleReg = () => {
    // console.log('牛马');
    setVisible(true);
  };
  return (
    <>
      <Button type="primary" onClick={handleReg} alt="" className="btn1">
        登录
      </Button>
      <Modal
        width="45%"
        wrapClassName={"regster-modal"}
        destroyOnClose={true}
        centered="true"
        title={<><img src={LoginIcon} width="16" height="16" alt="" style={{ marginRight: '10px' }} />登录界面</>}
        visible={visible}
        onOk={(e) => {
          setVisible(false);
        }}
        onCancel={(e) => {
          setVisible(false);
        }}
        bodyStyle={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'transparent' //半透明的背景色
        }}
        footer={[
          <Button type="primary" onClick={handleRegister} alt="" className="btn1" key="registerButton">
            注册
          </Button>,
          <Button type="primary" onClick={onLoginFinish} key="submitButton">
            提交
          </Button>
        ]}
      >
        <BackgroundVideo />

        <div style={{
          backgroundColor: ' transparent',
          position: 'relative',
          zIndex: 0,
          right: '60px',
          top: '25px',
          height: '280px' // Optional: if you want to center the form vertically in the viewport
        }}>
          <Form
            preserve={false}
            validateTrigger={["onBlur", "onChange"]}
            {...layout}
            name="basic"
            initialValues={{ remember: true, username: regUsername, password: regPassword }}
            ref={LoginForm}
            className="login-from"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: "请输入你的用户名" },
                { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
                { min: 3, message: "用户名至少为3位" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: "密码为必填项",
                },
                {
                  min: 6,
                  message: "请输入至少6位密码",
                  validateTrigger: "onBlur",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label="验证码" name="captcha">
              <Row gutter={16}>
                <Col span={16} >
                  <Input placeholder={countdown > 0 ? `${countdown}s` : '请输入验证码'} />
                </Col>
                <Col span={8}>
                  <Captcha />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item {...tailLayout}></Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        width="45%"
        wrapClassName={"register-modal"}
        destroyOnClose={true}
        centered="true"
        title="注册界面"
        visible={registerVisible}
        onOk={handleRegisterOk}
        onCancel={handleRegisterCancel}
        footer={[
          <Button type="primary" onClick={onFinish} key={"submit"}>
            提交
          </Button>
        ]}
      >
        <Form
          preserve={false}
          validateTrigger={["onBlur", "onChange"]}
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          ref={Regform}
          className="regfrom"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入你的用户名" },
              { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
              { min: 3, message: "用户名至少为3位" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "密码为必填项",
              },
              {
                min: 6,
                message: "请输入至少6位密码",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]} //当字段间存在依赖关系时使用。如果一个字段设置了 dependencies 属性。那么它所依赖的字段更新时，该字段将自动触发更新与校验。
            rules={[
              {
                required: true,
                message: "确认你的密码",
              },
              (props) => {
                return {
                  validator(_, value) {
                    // console.log(_);//{field: 'confirmPassword', fullField: 'confirmPassword', type: 'string', validator: ƒ}
                    // 这里面的value就是输入框的值
                    if (!value || props.getFieldValue("password") === value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error("您输入的两个密码不匹配")
                      );
                    }
                  },
                };
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}></Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LoginRegister;
