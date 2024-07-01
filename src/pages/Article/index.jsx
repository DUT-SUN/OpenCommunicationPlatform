import img404 from "@/assets/error.png";
import "./index.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Table,
  Tag,
  Space,
  Card,
  Breadcrumb,
  Form,
  Button,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  message,
  
} from "antd";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import { DeleteOutlined, EyeOutlined ,EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { http } from "@/utils";
import { useStore } from "@/store";
import { getName } from "@/utils/name";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Article = () => {
  const navigate = useNavigate();

  const { ArticleStore } = useStore();
  const [filteredList, setFilteredList] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const loadList = async () => {
      const data = await ArticleStore.getArticleList();
      const dataArray = Object.values(data);
      const flatArray = dataArray.flat();
      ArticleStore.setArticleList(flatArray);
      setFilteredList(flatArray);

      // 检查 URL 中是否有 keyword 参数
      const params = new URLSearchParams(location.search);
      const keyword = params.get("keyword");
      if (keyword) {
        // 如果有，调用 onFinish 函数进行过滤
        onFinish({ search: keyword });
      }
    };
    if (getName() != null) {
      loadList();
    }
  }, []);

  const onFinish = (values) => {
    const { keyword, date, search } = values;
    let tempFilteredList = [...ArticleStore.ArticleList];

    if (search) {
      tempFilteredList = tempFilteredList.filter((item) => {
        if (item.hasOwnProperty("title")) {
          return item.title.includes(search);
        } else {
          return true;
        }
      });
    }

    if (date) {
      const [startDate, endDate] = date;
      tempFilteredList = tempFilteredList.filter((item) => {
        let itemDate = moment(item.createdAt, "YYYY/M/D H:mm:ss");
        itemDate = itemDate.startOf("day");
        let start = moment(startDate).startOf("day");
        let end = moment(endDate).startOf("day");
        return itemDate.isBetween(start, end, null, "[]");
      });
    }

    setFilteredList(tempFilteredList);
  };

  // 删除文章
  const delArticle = async (data) => {
    const updatedList = filteredList.filter((item) => item.id !== data.id);
    setFilteredList(updatedList);
    const res=await ArticleStore.delArticle(data.id);
    message.success(res.msg)
  };
  const editArticle=async(data)=>{
    navigate(`/admin/publish/${data.id}`);
  }
  const goDetail = (data) => {
    navigate(`/list/detail?id=${data.id}`);
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "文件名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "点击数",
      dataIndex: "rcount",
      key: "rcount",
    },
    {
      title: "评论数",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "收藏数",
      dataIndex: "favorite",
      key: "favorite",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      render: state => {
        return state == 1 ? "公开" : "私有"
      }
    },
    {
      title: "操作",
      key: "operation",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              className ="detail"
              icon={<EyeOutlined />}
              onClick={() => goDetail(data)}
            />
            <Button
              type="primary"
              className ="edit"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => editArticle(data)}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
              
          </Space>
        );
      },
      fixed: "right",
    },
  ];

  return (
    <div className="Article-contianer">
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">"  items={[
            { title:   <Link to="/admin">后台管理</Link> }
            ,
            {
              title: "内容管理"
            }
          ]}/>
          
        }
        style={{ marginBottom: 5 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ keyword: null, date: null, search: null }}
        >
          <Form.Item label="检索内容" name="keyword">
            <Select placeholder="请选择内容或文件名" style={{ width: 200 }}>
              <Option value="文件名">文件名</Option>
              <Option value="内容">内容</Option>
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            <RangePicker locale={locale} />
          </Form.Item>
          <Row gutter={8}>
            <Col span={7}>
              <Form.Item label="检索" name="search">
                <Input
                  placeholder="输入检索关键字"
                  style={{ width: "286px", height: "31.6px" }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  筛选
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card
        title={`根据筛选条件共查询到 ${filteredList.length} 条结果：`}
        className="cardContext"
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredList}
          // pagination={
          //   {
          //     pageSize: params.per_page,
          //     total: ArticleStore.ArticleList.length,
          //     onChange: pageChange,
          //     current: params.page
          //   }
          // }
          bordered
        />
      </Card>
    </div>
  );
};

export default observer(Article);
