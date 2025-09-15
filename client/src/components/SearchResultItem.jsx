import IssueItem from "../components/IssueItem";
import BookItem from "./BookItem";

function SearchResultItem(props) {
    return (
        <div>
            {
                props.info.issueTitle ?
                    <IssueItem issueInfo={props.info} />
                    :
                    <BookItem bookInfo={props.info} />
            }
        </div>
    );

}

export default SearchResultItem;