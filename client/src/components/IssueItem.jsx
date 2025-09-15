import { useState, useEffect } from 'react';
import { formatDate } from "../utils/tools.js"
import { getTypeList } from "../redux/typeSlice";
import styles from "../css/IssueItem.module.css";
import { Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../api/user";
import { useNavigate } from 'react-router-dom';

// 每一条问答的项目
function IssueItem(props) {

    const dispatch = useDispatch();
    const { typeList } = useSelector(state => state.type);
    const [userInfo, setUserInfo] = useState({}); // 存储用户的信息
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    const navigate = useNavigate();

    useEffect(() => {
        if (!typeList.length) {
            // 派发 action 来发送请求，获取到数据填充到状态仓库
            dispatch(getTypeList());
        }

        // 发送请求获取用户的信息
        async function fetchUserData() {
            const { data } = await getUserById(props.issueInfo.userId);
            setUserInfo(data);
        }
        fetchUserData();
    }, [])

    const type = typeList.find(item => item._id === props.issueInfo.typeId);
    return (
        <div className={styles.container}>
            {/* 回答数 */}
            <div className={styles.issueNum}>
                <div>{props.issueInfo.commentNumber}</div>
                <div>回答</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.issueNum}>
                <div>{props.issueInfo.scanNumber}</div>
                <div>浏览</div>
            </div>
            {/* 内容部分 */}
            <div className={styles.issueContainer}>
                {/* 问答标题 */}
                <div
                    className={styles.top}
                    onClick={() => navigate(`/issues/${props.issueInfo._id}`)}
                >
                    {props.issueInfo.issueTitle}
                </div>

                <div className={styles.bottom}>
                    <div className={styles.left}>
                        {/* 分类 */}
                        <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
                    </div>
                    <div className={styles.right}>
                        {/* 用户 */}
                        <Tag color="volcano">{userInfo?.nickname}</Tag>
                        {/* 时间 */}
                        <span>{formatDate(props.issueInfo.issueDate, 'year')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueItem;