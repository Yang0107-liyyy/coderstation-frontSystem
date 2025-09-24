import { useState, useEffect } from "react";
import { Layout, message } from 'antd';
import NavHeader from "./components/NavHeader";
import PageFooter from "./components/PageFooter";
import { getInfo, getUserById } from "./api/user.js";
import { changeLoginStatus, initUserInfo } from "./redux/userSlice.js";
import { useDispatch } from "react-redux";

import "./css/App.css";

import RouteBefore from "./router/RouteBefore"

import LoginForm from "./components/LoginForm"

const { Header, Footer, Content } = Layout;


function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // 加载根组件，需要恢复用户的登录状态
  useEffect(() => {
    async function fetchData() {
      const result = await getInfo();
      if (result.data) {//token有效
        const { data } = await getUserById(result.data._id);
        dispatch(initUserInfo(data));
        dispatch(changeLoginStatus(true));
      } else {
        message.warning(result.msg);
        localStorage.removeItem("userToken");
      }
    }
    if (localStorage.getItem("userToken")) {
      fetchData();
    }
  }, [])

  /**
   * 关闭弹框
   */
  function closeModal() {
    setIsModalOpen(false);
  }

  /**
   * 打开弹框
   */
  function loginHandle() {
    setIsModalOpen(true);
  }

  return (
    <div className="App">
      {/* 头部 */}
      <Header className="header">
        <NavHeader loginHandle={loginHandle} />
      </Header>
      {/* 匹配上的路由页面 */}
      <Content className="content">
        <RouteBefore />
      </Content>
      {/* 底部 */}
      <Footer className="footer">
        <PageFooter />
      </Footer>
      {/* 登录弹窗 */}
      <LoginForm isShow={isModalOpen} closeModal={closeModal} />
    </div>
  )

}

export default App;
