import { Image } from "antd"
import styles from "../css/BookItem.module.css";
import { useNavigate } from 'react-router-dom';


function BookItem(props) {
    const navigate = useNavigate();
    const reg = /<[^<>]+>/g;
    const bookIntro = props.bookInfo.bookIntro.replace(reg, "");
    return (
        <div className={styles.container}>
            {/* 评论数 */}
            <div className={styles.bookNum}>
                <div>{props.bookInfo.commentNumber}</div>
                <div>评论</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.bookNum}>
                <div>{props.bookInfo.scanNumber}</div>
                <div>浏览</div>
            </div>
            <div className={styles.bookContainer}>
                {/* 封面 */}
                <div className={styles.left}>
                    <Image className={styles.bookPic} src={props.bookInfo.bookPic} />
                </div>
                {/* 标题及简介 */}
                <div className={styles.right}>
                    <div
                        className={styles.top}
                        onClick={() => navigate(`/books/${props.bookInfo._id}`)}
                        style={{ cursor: "pointer" }}
                    >
                        {props.bookInfo.bookTitle}
                    </div>
                    <div className={styles.bottom}>
                        {bookIntro.slice(0, 55) + '...'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookItem;