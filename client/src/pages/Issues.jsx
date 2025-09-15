import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import IssueItem from '../components/IssueItem';
import AddIssueBtn from '../components/AddIssueBtn';
import Recommend from '../components/Recommend';
import ScoreRank from '../components/ScoreRank';
import { Pagination } from 'antd';
import { getIssueByPage } from "../api/issue";
import styles from "../css/Issue.module.css";
import TypeSelect from '../components/TypeSelect';
import { useSelector } from "react-redux";

function Issues(props) {
    // 存储获取到的状态列表
    const [issueInfo, setIssueInfo] = useState([]);
    // 分页信息
    const [pageInfo, setPageInfo] = useState({
        current: 1, // 当前是第一页
        pageSize: 15, // 每页显示15条数据
        total: 0, // 数据总条数
    })
    // 从状态仓库获取当前是否有 typeId 的值
    const { issueTypeId } = useSelector(state => state.type);

    // 处理翻页的回调函数
    function handlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize
        })
    }

    useEffect(() => {
        async function fetchData() {
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true,
            }
            if (issueTypeId !== 'all') {
                searchParams.typeId = issueTypeId;
                searchParams.current = 1;
            }

            const { data } = await getIssueByPage(searchParams);
            setIssueInfo(data.data);
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count
            })
        }
        fetchData();
    }, [pageInfo.current, pageInfo.pageSize, issueTypeId])

    let issueList = [];
    for (let i = 0; i < issueInfo.length; i++) {
        issueList.push(<IssueItem key={i} issueInfo={issueInfo[i]} />)
    }

    return (
        <div className={styles.container}>
            {/* 头部 */}
            <PageHeader title='问答列表' >
                <TypeSelect />
            </PageHeader>
            {/* 内容部分 */}
            <div className={styles.issueContainer}>
                {/* 左边区域 */}
                <div className={styles.leftSide}>
                    {issueList}
                    {
                        issueInfo.length > 0 ? (<div className='paginationContainer'>
                            <Pagination
                                showQuickJumper
                                defaultCurrent={1}
                                {...pageInfo}
                                onChange={handlePageChange}
                            />
                        </div>) : (
                            <div className={styles.noIssue}>有问题，就来 coder station！</div>
                        )
                    }
                </div>
                {/* 右边区域 */}
                <div className={styles.rightSide}>
                    <AddIssueBtn />
                    <div style={{ marginBottom: "40px" }}>
                        <Recommend />
                    </div>
                    <ScoreRank />
                </div>
            </div>
        </div>
    );
}

export default Issues;
