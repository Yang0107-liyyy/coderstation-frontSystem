import { Route, Routes, Navigate } from "react-router-dom";

// 引入页面
import Issues from '../pages/Issues';
import IssueDetail from "../pages/IssueDetail";
import Books from '../pages/Books';
import BookDetail from "../pages/BookDetail";
import Interviews from '../pages/Interviews';
import AddIssue from "../pages/AddIssue";
import SearchPage from "../pages/SearchPage";
import Personal from "../pages/Personal";

function RouteConfig() {
    return (
        <Routes>
            <Route path="/issues" element={<Issues />} />
            <Route path="/addIssue" element={<AddIssue />} />
            <Route path="/issues/:id" element={<IssueDetail />} />

            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />

            <Route path="/interviews" element={<Interviews />} />
            <Route path="/searchPage" element={<SearchPage />} />
            <Route path="/personal" element={<Personal />} />

            <Route path="/" element={<Navigate replace to="/issues" />} />
        </Routes>
    )
}

export default RouteConfig;
