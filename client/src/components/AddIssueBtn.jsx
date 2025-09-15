import React from 'react';
import { Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


// 添加问答按钮组件
function AddIssueBtn(props) {

    const { isLogin } = useSelector(state => state.user);
    const navigate = useNavigate()

    function clickHandle() {
        // 判断是否登录
        if (isLogin) {// 跳转页面
            navigate("/addIssue");
        } else {// 弹出提示，请先登录
            message.warning('请先登录');
        }
    }

    return (
        <Button
            type='primary'
            size='large'
            style={{
                width: '100%',
                marginBottom: '30px'
            }}
            onClick={clickHandle}
        >我要发问</Button>
    );
}

export default AddIssueBtn;