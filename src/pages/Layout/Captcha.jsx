import React, { useState, useEffect } from 'react';
import { Spin, Form, Input } from 'antd';
import captchaStore from '@/store/Captcha.Store';
import flagStore from '@/store/FlagStore';
function Captcha() {
    
    
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        captchaStore.getCaptcha().then(() => setLoading(false));
    }, [flagStore.flag]);
    if (loading) {
        return <Spin />;
    }
    return (
        <>
        <img src={captchaStore.captchaImg} onClick={() => flagStore.Setflag(!flagStore.flag)} alt="captcha" />
        </>
    );
};

export default Captcha;
