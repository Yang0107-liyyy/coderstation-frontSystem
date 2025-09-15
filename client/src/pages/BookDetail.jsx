import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Discuss from "../components/Discuss";
import { useParams } from "react-router-dom";
import { getBookById, updateBook } from '../api/book';
import { Image, Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { editUser } from '../api/user';
import { updateUserInfo } from '../redux/userSlice';

import styles from "../css/BookDetail.module.css"


function BookDetail(props) {

    // 获取点击的书籍的id
    const { id } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    // 从仓库获取用户是否登录
    const { userInfo, isLogin } = useSelector(state => state.user);

    const dispatch = useDispatch();

    // 根据对应的书籍id，获取书籍的相关信息
    useEffect(() => {
        async function fetchData() {
            const { data } = await getBookById(id);

            // 将获取到的书籍信息存储到 bookInfo
            setBookInfo(data);

            // 点击该书籍时浏览数+1
            updateBook(data._id, {
                scanNumber: ++data.scanNumber
            })
        }
        fetchData();
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        // 确定下载，要先判断积分够不够
        if (userInfo.points < bookInfo.requirePoints) {//积分不够
            message.warning('当前积分不足');
        } else {//积分足够下载
            // 服务器需要扣除积分
            editUser(userInfo._id, {
                points: userInfo.points - bookInfo.requirePoints
            })
            // 仓库也需要扣除积分
            dispatch(updateUserInfo({
                points: userInfo.points - bookInfo.requirePoints
            }))
            // 跳转到下载地址
            window.open(`${bookInfo.downloadLink}`);
            message.success('积分已扣除');
        }
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <PageHeader title="书籍详情" />
            {/* 书籍详情内容 */}
            <div className={styles.bookInfoContainer}>
                {/* 书籍封面及下载 */}
                <div className={styles.leftSide}>
                    {/* 书籍封面 */}
                    <div className={styles.img}>
                        <Image
                            height={350}
                            src={bookInfo?.bookPic}
                        />
                    </div>
                    {/* 下载 */}
                    <div className={styles.link}>
                        <span>
                            下载所需积分：
                            <span className={styles.requirePoints}>
                                {bookInfo?.requirePoints}
                            </span>
                            分
                        </span>
                        {
                            isLogin ? (
                                <div className={styles.downloadLink} onClick={showModal}>
                                    百度云下载地址
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                {/* 书籍具体内容 */}
                <div className={styles.rightSide}>
                    <h1 className={styles.title}>{bookInfo?.bookTitle}</h1>
                    <div dangerouslySetInnerHTML={{ __html: bookInfo?.bookIntro }}></div>
                </div>
            </div>
            {/* 评论区域 */}
            <div className={styles.comment}>
                <Discuss
                    bookInfo={bookInfo}
                    commentType={2}
                    targetId={bookInfo?._id}
                />
            </div>
            <Modal title="重要提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    是否使用
                    <span className={styles.requirePoints}>
                        {bookInfo?.requirePoints}
                    </span>
                    积分下载此书籍？
                </p>
            </Modal>
        </div>
    );
}

export default BookDetail;