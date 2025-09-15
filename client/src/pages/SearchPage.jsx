import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from "../components/PageHeader"
import AddIssueBtn from "../components/AddIssueBtn"
import Recommend from "../components/Recommend"
import ScoreRank from "../components/ScoreRank";
import { getIssueByPage } from "../api/issue";
import { getBookByPage } from '../api/book';
import SearchResultItem from "../components/SearchResultItem"
import { Pagination } from "antd"

import styles from "../css/SearchPage.module.css"
// 搜索结果页面
function SearchPage(props) {

    const location = useLocation();
    const [searchResult, setSearchResult] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    })

    useEffect(() => {
        async function fetchData(state) {
            const { value, searchOption } = state;
            let searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true,
            }
            switch (searchOption) {
                case 'issue': {
                    searchParams.issueTitle = value;
                    const { data } = await getIssueByPage(searchParams);
                    // 更新搜索结果
                    setSearchResult(data.data);
                    // 更新分页信息
                    setPageInfo({
                        current: data.currentPage,
                        pageSize: data.eachPage,
                        total: data.count,
                    });
                    break;
                }
                case 'book': {
                    searchParams.bookTitle = value;
                    const { data } = await getBookByPage(searchParams);
                    // 更新搜索结果
                    setSearchResult(data.data);
                    // 更新分页信息
                    setPageInfo({
                        current: data.currentPage,
                        pageSize: data.eachPage,
                        total: data.count,
                    });
                    break;
                }
            }
        }
        if (location.state) {
            fetchData(location.state);
        }
    }, [location.state, pageInfo.current, pageInfo.pageSize])

    function handlePageChange(current, pageSize) {
        setPageInfo({
            current,
            pageSize
        })
    }

    return (
        <div className="container">
            <PageHeader title="搜索结果" />
            <div className={styles.searchPageContainer}>
                {/* 左边部分 */}
                <div className={styles.leftSide}>
                    {
                        searchResult.map(item => {
                            return <SearchResultItem info={item} key={item._id} />
                        })
                    }
                    {
                        searchResult.length > 0 ? (
                            <div className="paginationContainer">
                                <Pagination
                                    showQuickJumper
                                    defaultCurrent={1}
                                    {...pageInfo}
                                    onChange={handlePageChange}
                                />
                            </div>
                        ) : (
                            <div className={styles.noResult}>
                                未搜索到符合条件的条目
                            </div>
                        )
                    }
                </div>
                {/* 右边部分 */}
                <div className={styles.rightSide}>
                    <AddIssueBtn />
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

export default SearchPage;