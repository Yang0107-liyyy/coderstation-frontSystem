import { useRef, useState, useEffect } from 'react';
import { Comment, Avatar, Form, Button, List, Tooltip, message, Pagination, Input } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { addComment, getIssueCommentById, getBookCommentById } from "../api/comment";
import { getUserById } from "../api/user";
import { formatDate } from "../utils/tools";
import { updateIssue } from "../api/issue";
import { updateBook } from '../api/book';
import { updateUserInfoAsync } from "../redux/userSlice";

import styles from "../css/Discuss.module.css"


// 评论组件
function Discuss(props) {
    // 从仓库获取用户信息以及登录状态
    const { userInfo, isLogin } = useSelector(state => state.user);
    // 存储评论列表
    const [commentList, setCommentList] = useState([]);
    // 评论刷新
    const [refresh, setRefresh] = useState(false);
    // 存储分页状态
    const [pageInfo, setPageInfo] = useState({
        current: 1, // 当前是第一页
        pageSize: 10, // 每一页显示 10 条数据
        total: 0, // 数据的总条数
    });
    // 书籍评论内容
    const [value, setValue] = useState('');

    const dispatch = useDispatch();

    // 通过关联ref，拿到评论编辑器的内容
    const editorRef = useRef();

    // 发送请求，得到评论
    useEffect(() => {
        async function fetchCommentList() {
            let data = null;
            if (props.commentType === 1) {//获取的是问答的评论
                const result = await getIssueCommentById(props.targetId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize
                });
                data = result.data;
            } else if (props.commentType === 2) {//获取的是书籍的评论
                const result = await getBookCommentById(props.targetId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize
                });
                data = result.data;
            }
            for (let i = 0; i < data.data.length; i++) {
                const result = await getUserById(data.data[i].userId);
                // 将用户的信息添加到评论对象上面
                data.data[i].userInfo = result.data;
            }
            // 更新评论数据
            setCommentList(data.data);
            // 更新分页数据
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count,
            })
        }
        if (props.targetId) {
            fetchCommentList();
        }
    }, [props.targetId, refresh, pageInfo.current, pageInfo.pageSize])


    // 根据是否登录对头像进行处理
    let avatar = null;
    if (isLogin) {
        avatar = (<Avatar src={userInfo.avatar} />);
    } else {
        avatar = (<Avatar icon={<UserOutlined />} />);
    }


    // 添加评论的回调函数
    function onSubmit() {
        let newComment = null;

        if (props.commentType === 1) {// 说明是新增问答的评论
            newComment = editorRef.current.getInstance().getHTML();
            if (newComment === "<p><br></p>") {
                newComment = "";
            }
        } else if (props.commentType === 2) {// 说明是新增书籍的评论
            newComment = value;
        }

        if (!newComment) {
            message.warning("请输入评论内容");
            return;
        } else {
            if (props.commentType === 1) {
                addComment({
                    userId: userInfo._id,
                    issueId: props.targetId,
                    typeId: props.issueInfo.typeId,
                    commentContent: newComment,
                    commentType: props.commentType
                })
                // 更新该问答评论数
                updateIssue(props.targetId, {
                    commentNumber: ++props.issueInfo.commentNumber
                });
                // 更新积分的变化
                dispatch(updateUserInfoAsync({
                    userId: userInfo._id,
                    newInfo: {
                        points: userInfo.points + 4
                    }
                }));
                message.success("评论添加成功，积分+4");
                // 将编辑器的评论内容清空
                editorRef.current.getInstance().setHTML("");
            } else if (props.commentType === 2) {
                addComment({
                    userId: userInfo._id,
                    bookId: props.targetId,
                    typeId: props.bookInfo.typeId,
                    commentContent: newComment,
                    commentType: props.commentType
                })
                updateBook(props.targetId, {
                    commentNumber: ++props.bookInfo.commentNumber
                })
                dispatch(updateUserInfoAsync({
                    userId: userInfo._id,
                    newInfo: {
                        points: userInfo.points + 2
                    }
                }));
                message.success("评论添加成功，积分+2");
                setValue("");
            }
            // 刷新评论列表
            setRefresh(!refresh);
        }
    }


    function hangdlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize
        })
    }


    return (
        <div>
            {/* 评论框 */}
            <Comment
                avatar={avatar}
                content={
                    <>
                        <Form.Item>
                            {
                                props?.commentType === 1 ? (
                                    <Editor
                                        initialValue=""
                                        previewStyle="vertical"
                                        height="270px"
                                        initialEditType="wysiwyg"
                                        useCommandShortcut={true}
                                        language='zh-CN'
                                        ref={editorRef}
                                        className="editor"
                                    />
                                ) : (
                                    <Input.TextArea
                                        rows={4}
                                        placeholder={isLogin ? "" : "请登录后评论..."}
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type='primary'
                                disabled={isLogin ? false : true}
                                onClick={onSubmit}
                            >添加评论</Button>
                        </Form.Item>
                    </>
                }
            />
            {/* 评论列表 */}
            {
                commentList?.length > 0
                &&
                <List
                    header="当前评论"
                    dataSource={commentList}
                    itemLayout="horizontal"
                    renderItem={function (props) {
                        return (
                            <Comment
                                avatar={<Avatar src={props.userInfo?.avatar} />}
                                content={
                                    <div
                                        dangerouslySetInnerHTML={{ __html: props.commentContent }}
                                    ></div>
                                }
                                datetime={
                                    <Tooltip title={formatDate(props.commentDate)}>
                                        <span>{formatDate(props.commentDate, 'year')}</span>
                                    </Tooltip>
                                }
                            />
                        )
                    }}
                />
            }
            {/* 分页 */}
            {
                commentList.length > 0 ? (
                    <div className={styles.paginationContainer}>
                        <Pagination
                            showQuickJumper
                            defaultCurrent={1}
                            total={pageInfo.total}
                            onChange={hangdlePageChange}
                        />
                    </div>
                ) : (
                    <div style={{
                        fontWeight: "200",
                        textAlign: "center",
                        margin: "50px"
                    }}
                    >暂无评论</div>
                )
            }
        </div>
    );
}

export default Discuss;