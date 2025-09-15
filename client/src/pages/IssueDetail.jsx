import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIssueById, updateIssue } from '../api/issue';
import { getUserById } from "../api/user";
import PageHeader from "../components/PageHeader";
import ScoreRank from "../components/ScoreRank"
import Recommend from "../components/Recommend";
import Discuss from "../components/Discuss";
import { formatDate } from "../utils/tools";
import { Avatar } from "antd";

import styles from "../css/IssueDetail.module.css";
// 问答详情
function IssueDetail(props) {

    const { id } = useParams();
    const [issueInfo, setIssueInfo] = useState(null);
    const [issueUser, setIssueUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            // 得到每条问答的详情数据
            const { data } = await getIssueById(id);
            setIssueInfo(data);
            const result = await getUserById(data.userId);
            setIssueUser(result.data);

            //更新浏览数
            updateIssue(data._id, {
                scanNumber: ++data.scanNumber
            })
        }
        fetchData();
    }, [])

    return (
        <div className={styles.container}>
            <PageHeader title="问题详情" />
            <div className={styles.detailContainer}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                    {/* 问答详情 */}
                    <div className={styles.question}>
                        <h1>{issueInfo?.issueTitle}</h1>
                        <div className={styles.questioner}>
                            <Avatar size="small" src={issueUser?.avatar} />
                            <span className={styles.user}>{issueUser?.nickname}</span>
                            <span>发布于：{formatDate(issueInfo?.issueDate)}</span>
                        </div>
                        <div className={styles.content}>
                            <div dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}></div>
                        </div>
                    </div>
                    {/* 评论 */}
                    <Discuss
                        commentType={1}
                        targetId={issueInfo?._id}
                        issueInfo={issueInfo}
                    />
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                    <div style={{ marginBottom: 20 }}>
                        <Recommend />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <ScoreRank />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueDetail;