import React, { useState } from 'react';
import { Avatar, Col, Divider, Drawer, List, Row } from 'antd';
import ReplyCardStore from '@/store/ReplyCard.Store'
import { observer } from "mobx-react-lite";
import  './index.scss';
const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);
const ReplyCard = () => {
    return (
        <>
            <Drawer width={640} placement="right" closable={false} onClose={ReplyCardStore.onClose} open={ReplyCardStore.open}>
                <p
                    className="site-description-item-profile-p"
                    style={{
                        marginBottom: 24,
                    }}
                >
                    用户信息
                </p>
                <p className="site-description-item-profile-p">个人</p>
                <Row className="row-spacing">
                    <Col span={12}>
                        <DescriptionItem title="全名" content="admin" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="邮箱" content="SUN030920@163.com" />
                    </Col>
                </Row>
                <Row className="row-spacing">
                    <Col span={12}>
                        <DescriptionItem title="城市" content="大连" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="国家" content="中国" />
                    </Col>
                </Row>
                
                <Row className="row-spacing">
                    <Col span={24}>
                        <DescriptionItem
                            title="个性签名"
                            content="这个人很懒，没有个性签名"
                        />
                    </Col>
                </Row>
                <Divider />
                <p className="site-description-item-profile-p">公司</p>
                <Row className="row-spacing">
                    <Col span={12}>
                        <DescriptionItem title="职位" content="暂无" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="擅长" content="Coding" />
                    </Col>
                </Row>
                <Row className="row-spacing">
                    <Col span={12}>
                        <DescriptionItem title="部门" content="暂无" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="+1" content={<a>Lin</a>} />
                    </Col>
                </Row>
                <Row className="row-spacing">
                    <Col span={24}>
                        <DescriptionItem
                            title="技能"
                            content="很能吃算嘛"
                        />
                    </Col>
                </Row>
                <Divider />
                <p className="site-description-item-profile-p">联系方式</p>
                <Row className="row-spacing">
            
                    <Col span={12}>
                        <DescriptionItem title="Phone Number" content="+86 13657182310" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem
                            title="Github"
                            content={
                                <a href="http://github.com/DUT-SUN/">
                                    github.com/DUT-SUN/
                                </a>
                            }
                        />
                    </Col>
                </Row>

            </Drawer>
        </>
    );
};
export default observer(ReplyCard);